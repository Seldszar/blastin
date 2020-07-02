import clsx from "clsx";
import { withRouter, Router } from "next/router";
import { Component } from "react";
import Sockette from "sockette";
import { parse as parseMessage, Message } from "tekko";

import { HOSTING_PATTERN } from "lib/constants";
import { withStore, EventInstance, StoreInstance } from "stores";

import StreamStatus from "components/stream-status";

import styles from "./dashboard-layout.module.scss";

class DashboardLayout extends Component<{
  router: Router;
  store: StoreInstance;
}> {
  readonly state = {
    socketState: "opening",
  };

  private readonly pendingMysteryGifts = new Map();
  private readonly commandHandlers = new Map<
    string,
    (message: Message) => Partial<EventInstance> | void
  >([
    [
      "PING",
      ({ trailing }) => {
        this.socket?.send(`PONG :${trailing}`);
      },
    ],
    [
      "USERNOTICE",
      ({ middle, tags, trailing }) => {
        if (!tags) {
          return;
        }

        switch (tags["msg-id"]) {
          case "bitsbadgetier": {
            return {
              id: tags.id as string,
              channel: middle[0].slice(1),
              type: tags["msg-id"] as string,
              user: {
                login: tags.login as string,
              },
              data: {
                threshold: tags["msg-param-threshold"],
              },
            };
          }

          case "giftpaidupgrade": {
            return {
              id: tags.id as string,
              channel: middle[0].slice(1),
              type: tags["msg-id"] as string,
              user: {
                login: tags.login as string,
              },
              data: {
                sender: {
                  login: tags["msg-param-sender-login"],
                  displayName: tags["msg-param-sender-name"],
                },
              },
            };
          }

          case "raid": {
            return {
              id: tags.id as string,
              channel: middle[0].slice(1),
              type: tags["msg-id"] as string,
              user: {
                login: tags.login as string,
              },
              data: {
                viewerCount: Number(tags["msg-param-viewerCount"]),
              },
            };
          }

          case "ritual": {
            return {
              id: tags.id as string,
              channel: middle[0].slice(1),
              type: tags["msg-id"] as string,
              user: {
                login: tags.login as string,
              },
            };
          }

          case "sub": {
            return {
              id: tags.id as string,
              channel: middle[0].slice(1),
              type: tags["msg-id"] as string,
              user: {
                login: tags.login as string,
              },
              data: {
                subscriptionPlan: tags["msg-param-sub-plan"],
              },
            };
          }

          case "anonsubgift":
          case "subgift": {
            const userId = tags["user-id"];

            const pendingMysteryGift = this.pendingMysteryGifts.get(userId);

            if (pendingMysteryGift) {
              this.store.updateEventData(pendingMysteryGift.eventId, (data) => ({
                recipients: data.recipients.concat({
                  login: tags["msg-param-recipient-user-name"],
                }),
              }));

              if (++pendingMysteryGift.current >= pendingMysteryGift.total) {
                this.pendingMysteryGifts.delete(userId);
              }

              return undefined;
            }

            return {
              id: tags.id as string,
              channel: middle[0].slice(1),
              type: tags["msg-id"] as string,
              user: {
                login: tags.login as string,
              },
              data: {
                subscriptionPlan: tags["msg-param-sub-plan"],
                recipient: {
                  login: tags["msg-param-recipient-user-name"],
                  displayName: tags["msg-param-recipient-display-name"],
                },
              },
            };
          }

          case "submysterygift": {
            const subscriptionCount = Number(tags["msg-param-mass-gift-count"]);

            this.pendingMysteryGifts.set(tags["user-id"], {
              eventId: tags.id as string,
              total: subscriptionCount,
              current: 0,
            });

            return {
              id: tags.id as string,
              channel: middle[0].slice(1),
              type: tags["msg-id"] as string,
              user: {
                login: tags.login as string,
              },
              data: {
                subscriptionCount: Number(tags["msg-param-mass-gift-count"]),
                subscriptionPlan: tags["msg-param-sub-plan"],
                recipients: [],
              },
            };
          }

          case "resub": {
            return {
              id: tags.id as string,
              channel: middle[0].slice(1),
              type: tags["msg-id"] as string,
              user: {
                login: tags.login as string,
                displayName: tags["display-name"] as string,
              },
              data: {
                comment: trailing,
                subscriptionPlan: tags["msg-param-sub-plan"],
                cumulativeMonths: Number(tags["msg-param-cumulative-months"]),
                streakMonths:
                  tags["msg-param-should-share-streak"] === "1"
                    ? Number(tags["msg-param-streak-months"])
                    : undefined,
              },
            };
          }

          default:
        }
      },
    ],
    [
      "PRIVMSG",
      ({ middle, prefix, tags, trailing }) => {
        if (!prefix || !tags) {
          return;
        }

        if (prefix.name === "jtv") {
          const matches = HOSTING_PATTERN.exec(trailing);

          if (matches) {
            const viewers = Number.parseInt(matches[3] || "0", 10);
            const isAuto = matches[2] === "auto";

            if (viewers > 0) {
              return {
                id: tags.id as string,
                channel: middle[0].slice(1),
                type: "host",
                user: {
                  login: matches[1],
                },
                data: {
                  isAuto,
                },
              };
            }
          }

          return;
        }

        if (tags.bits) {
          return {
            id: tags.id as string,
            channel: middle[0].slice(1),
            type: "cheer",
            user: {
              login: prefix.name,
              displayName: tags["display-name"] as string,
            },
            data: {
              bits: Number(tags.bits),
              comment: trailing,
            },
          };
        }
      },
    ],
  ]);

  private socket: Sockette | undefined;
  private intervalId: NodeJS.Timeout | undefined;

  private get store() {
    return this.props.store;
  }

  componentDidMount = async () => {
    try {
      const searchParameters = new URLSearchParams(location.search);
      const asLogin = searchParameters.get("as");

      await this.store.fetchUser(asLogin);
    } catch {
      await this.props.router.push("/login");
      return;
    }

    await this.updateStream();

    this.intervalId = setInterval(this.updateStream, 60000);
    this.socket = new Sockette("wss://irc-ws.chat.twitch.tv", {
      onclose: () => {
        this.setState({
          socketState: "closed",
        });
      },
      onopen: () => {
        if (!this.store.token || !this.store.user) {
          return;
        }

        this.socket?.send("CAP REQ :twitch.tv/tags twitch.tv/commands");
        this.socket?.send(`PASS oauth:${this.store.token}`);
        this.socket?.send(`NICK ${this.store.user.login}`);
        this.socket?.send(`JOIN #${this.store.user.login}`);

        this.setState({
          socketState: "open",
        });
      },
      onmessage: (event) => {
        const chunks = event.data.split("\r\n");

        for (const chunk of chunks) {
          if (chunk.length === 0) {
            continue;
          }

          this.handleMessage(parseMessage(chunk));
        }
      },
    });
  };

  componentWillUnmount = () => {
    this.socket?.close();

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <StreamStatus className={styles.streamStatus} />
        <main className={styles.main}>{this.props.children}</main>
        <footer className={styles.footer}>
          <div className={styles.socketState}>
            <div className={clsx(styles.stateIndicator, styles[this.state.socketState])} />
            Chat Connection
            {this.state.socketState === "closed" && (
              <div className={styles.reconnectButton} onClick={this.reconnect}>
                <span className="mdi ms-Icon--Plug" />
              </div>
            )}
          </div>
          <div className={styles.expander} />
          <div className={styles.credits}>
            Blastin by <a href="https://seldszar.fr">Seldszar</a>
          </div>
          <div className={styles.github}>
            <a href="https://github.com/seldszar/blastin" target="_blank" rel="noopener noreferrer">
              Github
            </a>
          </div>
        </footer>
      </div>
    );
  }

  private readonly handleMessage = (message: Message) => {
    const commandHandler = this.commandHandlers.get(message.command);

    if (commandHandler) {
      const event = commandHandler(message);

      if (event) {
        this.store.addEvent(event);
      }
    }
  };

  private readonly updateStream = async () => {
    try {
      await this.store.fetchStream();
    } catch (error) {
      console.error(error);
    }
  };

  private readonly reconnect = () => {
    this.socket?.reconnect();
  };
}

export default withRouter(withStore(DashboardLayout));

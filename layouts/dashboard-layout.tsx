import clsx from "clsx";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { FunctionComponent, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { parse as parseMessage, Message } from "tekko";

import { HOSTING_PATTERN, connectionStatus } from "lib/constants";
import { EventInstance, useStore } from "stores";

import StreamStatus from "components/stream-status";

import styles from "./dashboard-layout.module.scss";

const DashboardLayout: FunctionComponent = ({ children }) => {
  const router = useRouter();
  const store = useStore();

  const { sendMessage, readyState } = useWebSocket("wss://irc-ws.chat.twitch.tv", {
    retryOnError: true,
    onOpen() {
      if (!store.token || !store.user) {
        return;
      }

      sendMessage("CAP REQ :twitch.tv/tags twitch.tv/commands");
      sendMessage(`PASS oauth:${store.token}`);
      sendMessage(`NICK ${store.user.login}`);
      sendMessage(`JOIN #${store.user.login}`);
    },
    onMessage(event) {
      const chunks = event.data.split("\r\n");

      for (const chunk of chunks) {
        if (chunk.length === 0) {
          continue;
        }

        handleMessage(parseMessage(chunk));
      }
    },
  });

  const pendingMysteryGifts = new Map();
  const commandHandlers = new Map<string, (message: Message) => Partial<EventInstance> | void>([
    [
      "PING",
      ({ trailing }) => {
        sendMessage(`PONG :${trailing}`);
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

            const pendingMysteryGift = pendingMysteryGifts.get(userId);

            if (pendingMysteryGift) {
              store.updateEventData(pendingMysteryGift.eventId, (data) => ({
                recipients: data.recipients.concat({
                  login: tags["msg-param-recipient-user-name"],
                }),
              }));

              if (++pendingMysteryGift.current >= pendingMysteryGift.total) {
                pendingMysteryGifts.delete(userId);
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

            pendingMysteryGifts.set(tags["user-id"], {
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

  const handleMessage = (message: Message) => {
    const commandHandler = commandHandlers.get(message.command);

    if (commandHandler) {
      const event = commandHandler(message);

      if (event) {
        store.addEvent(event);
      }
    }
  };

  const updateStream = async () => {
    try {
      await store.fetchStream();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const update = async () => {
      try {
        const searchParameters = new URLSearchParams(location.search);
        const asLogin = searchParameters.get("as");

        await store.fetchUser(asLogin);
      } catch {
        return router.push("/login");
      }

      await updateStream();
    };

    update();
  }, []);

  return (
    <div className={styles.wrapper}>
      <StreamStatus className={styles.streamStatus} />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.socketState}>
          <div className={clsx(styles.stateIndicator, styles[connectionStatus[readyState]])} />
          Chat Connection
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
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export default DashboardLayout;

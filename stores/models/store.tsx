import arrayMove from "array-move";
import ky from "ky-universal";
import { applySnapshot, getSnapshot, types, flow, Instance } from "mobx-state-tree";

import { Event, EventInstance } from "./event";
import { Filter, FilterInstance } from "./filter";
import { Game } from "./game";
import { Stream } from "./stream";
import { User } from "./user";

export const Store = types
  .model({
    version: types.optional(types.number, 1),
    user: types.maybe(User),
    games: types.array(Game),
    stream: types.maybe(Stream),
    events: types.array(Event),
    filters: types.array(Filter),
    token: types.maybe(types.string),
  })
  .views((self) => ({
    exportFilters() {
      return {
        version: self.version,
        filters: getSnapshot(self.filters),
      };
    },
    findFilter(id: string) {
      return self.filters.find((filter) => filter.id === id);
    },
  }))
  .actions((self) => {
    const api = ky.extend({
      prefixUrl: "https://api.twitch.tv/helix",
      headers: {
        "Client-ID": process.env.CLIENT_ID as string,
      },
      hooks: {
        beforeRequest: [
          (request) => {
            if (self.token) {
              request.headers.set("Authorization", `Bearer ${self.token as string}`);
            }

            return request;
          },
        ],
      },
    });

    const setToken = (token?: string) => {
      self.token = token;
    };

    const importFilters = (data: any) => {
      if (data.version !== self.version) {
        throw new TypeError("Unsupported version");
      }

      applySnapshot(self.filters, data.filters);
    };

    const createFilter = (value: Partial<FilterInstance>) => {
      self.filters.push(value as FilterInstance);
    };

    const updateFilter = (filter: FilterInstance, values: Partial<FilterInstance>) => {
      Object.assign(filter, values);
    };

    const deleteFilter = (filter: FilterInstance) => {
      self.filters.remove(filter);
    };

    const moveFilter = (oldIndex: number, newIndex: number) => {
      self.filters.replace(arrayMove(self.filters, oldIndex, newIndex) as FilterInstance[]);
    };

    const addEvent = (event: Partial<EventInstance>) => {
      self.events.push(event as EventInstance);
    };

    const removeEvent = (event: EventInstance) => {
      self.events.remove(event);
    };

    const updateEventData = (id: string, updater: (data: any) => any) => {
      const event = self.events.find((event) => event.id === id);

      if (event) {
        event.updateData(updater(event.data));
      }
    };

    const fetchUser = flow(function* (asLogin: string | null) {
      const searchParameters = new URLSearchParams();

      if (asLogin) {
        searchParameters.set("login", asLogin);
      }

      const response = yield api.get("users", {
        searchParams: searchParameters,
      });

      const {
        data: [userData],
      } = yield response.json();

      if (!userData) {
        return;
      }

      self.user = {
        id: userData.id,
        login: userData.login,
        profileImageUrl: userData.profile_image_url,
      };
    });

    const fetchGame = flow(function* (gameId: string) {
      if (self.games.some((game) => game.id === gameId)) {
        return;
      }

      const response = yield api.get("games", {
        searchParams: {
          id: gameId,
        },
      });

      const {
        data: [gameData],
      } = yield response.json();

      if (!gameData) {
        return;
      }

      self.games.push({
        id: gameData.id,
        name: gameData.name,
      });
    });

    const fetchStream = flow(function* () {
      if (!self.user) {
        return;
      }

      const response = yield api.get("streams", {
        searchParams: {
          user_id: self.user.id,
        },
      });

      const {
        data: [streamData],
      } = yield response.json();

      if (!streamData) {
        self.stream = undefined;

        return;
      }

      if (streamData.game_id) {
        yield fetchGame(streamData.game_id);
      }

      self.stream = {
        id: streamData.id,
        title: streamData.title,
        game: streamData.game_id,
        viewerCount: streamData.viewer_count,
        startedAt: new Date(streamData.started_at),
      };
    });

    return {
      setToken,
      importFilters,
      createFilter,
      updateFilter,
      deleteFilter,
      moveFilter,
      addEvent,
      removeEvent,
      updateEventData,
      fetchUser,
      fetchGame,
      fetchStream,
    };
  });

export type StoreInstance = Instance<typeof Store>;

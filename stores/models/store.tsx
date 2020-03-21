import arrayMove from "array-move"
import { types, flow, Instance } from "mobx-state-tree"

import { Event, EventInstance } from "./event"
import { Filter, FilterInstance } from "./filter"
import { Game } from "./game"
import { Stream } from "./stream"
import { User } from "./user"

export const Store = types
  .model({
    user: types.maybe(User),
    games: types.array(Game),
    stream: types.maybe(Stream),
    events: types.array(Event),
    filters: types.array(Filter),
    token: types.maybe(types.string),
  })
  .views(self => ({
    findFilter(id: string) {
      return self.filters.find(filter => filter.id === id)
    },
  }))
  .actions(self => {
    const setToken = (token: string) => {
      self.token = token
    }

    const createFilter = (value: Partial<FilterInstance>) => {
      self.filters.push(value)
    }

    const updateFilter = (filter: FilterInstance, values: Partial<FilterInstance>) => {
      Object.assign(filter, values)
    }

    const deleteFilter = (filter: FilterInstance) => {
      self.filters.remove(filter)
    }

    const moveFilter = (oldIndex: number, newIndex: number) => {
      self.filters.replace(arrayMove(self.filters, oldIndex, newIndex) as FilterInstance[])
    }

    const addEvent = (event: Partial<EventInstance>) => {
      self.events.push(event)
    }

    const updateEventData = (id: string, updater: (data: any) => any) => {
      const event = self.events.find(e => e.id === id)

      if (event) {
        event.updateData(updater(event.data))
      }
    }

    const fetchUser = flow(function* (asLogin?: string) {
      const response = yield fetch(`https://api.twitch.tv/helix/users${asLogin ? `?login=${asLogin}` : ""}`, {
        headers: {
          Authorization: `Bearer ${self.token}`,
          "Client-ID": process.env.CLIENT_ID,
        }
      })

      const {
        data: [userData]
      } = yield response.json()

      if (userData == null) {
        return;
      }

      self.user = {
        id: userData["id"],
        login: userData["login"],
        displayName: userData["display_name"],
        profileImageUrl: userData["profile_image_url"],
      }
    })

    const fetchGame = flow(function* (gameId: string) {
      if (self.games.some(game => game.id === gameId)) {
        return;
      }

      const response = yield fetch(`https://api.twitch.tv/helix/games?id=${gameId}`, {
        headers: {
          Authorization: `Bearer ${self.token}`,
          "Client-ID": process.env.CLIENT_ID,
        }
      })

      const {
        data: [gameData]
      } = yield response.json()

      if (gameData == null) {
        return;
      }

      self.games.push({
        id: gameData["id"],
        name: gameData["name"],
      })
    })

    const fetchStream = flow(function* () {
      if (self.user == null) {
        return;
      }

      const response = yield fetch(`https://api.twitch.tv/helix/streams?user_id=${self.user.id}`, {
        headers: {
          Authorization: `Bearer ${self.token}`,
          "Client-ID": process.env.CLIENT_ID,
        }
      })

      const {
        data: [streamData]
      } = yield response.json()

      if (streamData == null) {
        self.stream = undefined

        return;
      }

      if (streamData["game_id"]) {
        yield fetchGame(streamData["game_id"])
      }

      self.stream = {
        id: streamData["id"],
        title: streamData["title"],
        game: streamData["game_id"],
        viewerCount: streamData["viewer_count"],
        startedAt: new Date(streamData["started_at"]),
      }
    })

    return {
      setToken,
      createFilter,
      updateFilter,
      deleteFilter,
      moveFilter,
      addEvent,
      updateEventData,
      fetchUser,
      fetchGame,
      fetchStream,
    }
  })

export type StoreInstance = Instance<typeof Store>

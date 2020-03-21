import { types, Instance } from "mobx-state-tree"
import uniqueString from "unique-string"

export const Event = types
  .model({
    id: types.optional(types.identifier, uniqueString),
    channel: types.string,
    type: types.string,
    date: types.optional(types.Date, () => new Date()),
    readState: types.optional(types.string, "unread"),
    user: types.model({
      login: types.string,
      displayName: types.maybe(types.string),
    }),
    data: types.frozen(),
  })
  .actions(self => {
    const markAsRead = () => {
      self.readState = "read"
    }

    const updateData = (data: any) => {
      self.data = { ...self.data, ...data }
    }

    return {
      markAsRead,
      updateData,
    }
  })

export type EventInstance = Instance<typeof Event>

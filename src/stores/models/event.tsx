import flat from "flat";
import { types, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";
import { nanoid } from "nanoid";

export const Event = types
  .model({
    id: types.optional(types.identifier, nanoid),
    channel: types.string,
    type: types.string,
    date: types.optional(types.Date, () => new Date()),
    readState: types.optional(types.string, "unread"),
    user: types.model({
      login: types.string,
    }),
    data: types.frozen(),
  })
  .views((self) => ({
    get eventValues(): string[][] {
      return Object.entries(flat({ type: self.type, data: self.data }));
    },
  }))
  .actions((self) => {
    const markAsRead = () => {
      self.readState = "read";
    };

    const updateData = (data: any) => {
      self.data = { ...self.data, ...data };
    };

    return {
      markAsRead,
      updateData,
    };
  });

export type EventInstance = Instance<typeof Event>;
export type EventSnapshotIn = SnapshotIn<typeof Event>;
export type EventSnapshotOut = SnapshotOut<typeof Event>;

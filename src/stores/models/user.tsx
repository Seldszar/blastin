import { types, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";

export const User = types.model({
  id: types.identifier,
  login: types.string,
  profileImageUrl: types.string,
});

export type UserInstance = Instance<typeof User>;
export type UserSnapshotIn = SnapshotIn<typeof User>;
export type UserSnapshotOut = SnapshotOut<typeof User>;

import { types, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";

export const Game = types.model({
  id: types.identifier,
  name: types.string,
});

export type GameInstance = Instance<typeof Game>;
export type GameSnapshotIn = SnapshotIn<typeof Game>;
export type GameSnapshotOut = SnapshotOut<typeof Game>;

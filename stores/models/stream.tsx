import { types, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";

import { Game } from "./game";

export const Stream = types.model({
  id: types.identifier,
  title: types.string,
  game: types.reference(Game),
  viewerCount: types.number,
  startedAt: types.Date,
});

export type StreamInstance = Instance<typeof Stream>;
export type StreamSnapshotIn = SnapshotIn<typeof Stream>;
export type StreamSnapshotOut = SnapshotOut<typeof Stream>;

import { types, Instance } from "mobx-state-tree";

export const Game = types.model({
  id: types.identifier,
  name: types.string,
});

export type GameInstance = Instance<typeof Game>;

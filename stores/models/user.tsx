import { types, Instance } from "mobx-state-tree"

export const User = types
  .model({
    id: types.identifier,
    login: types.string,
    displayName: types.string,
    profileImageUrl: types.string,
  })

export type UserInstance = Instance<typeof User>

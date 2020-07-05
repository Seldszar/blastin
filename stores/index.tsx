import "setimmediate";

import { applySnapshot } from "mobx-state-tree";
import { createContext, useContext } from "react";
import uniqueString from "unique-string";

import { Store, StoreInstance } from "./models";

export * from "./models";

export const StoreContext = createContext<StoreInstance>(Store.create());
export const useStore = (): StoreInstance => useContext<StoreInstance>(StoreContext);

let store: StoreInstance;

export function initializeStore(
  isServer: boolean,
  initialState?: Record<string, unknown>
): StoreInstance {
  if (isServer) {
    store = Store.create();
  }

  if (!store) {
    store = Store.create({
      filters: [
        {
          id: uniqueString(),
          icon: "Home",
          title: "All Events",
          query: "",
        },
        {
          id: uniqueString(),
          icon: "Cake",
          title: "Subscription Anniversaries",
          query: 'type == "resub" and (data.cumulativeMonths % 12) == 0',
        },
        {
          id: uniqueString(),
          icon: "AddFavorite",
          title: "New Subscriptions",
          query: 'type == "sub"',
        },
        {
          id: uniqueString(),
          icon: "Diamond",
          title: "Cheers",
          query: 'type == "cheer"',
        },
        {
          id: uniqueString(),
          icon: "GiftboxOpen",
          title: "Subscription Gifts",
          query: 'type == "subgift" or type == "anonsubgift" or type == "submysterygift"',
        },
        {
          id: uniqueString(),
          icon: "AddGroup",
          title: "Raids & Hosts",
          query: 'type == "raid" or type == "host"',
        },
      ],
    });
  }

  if (initialState) {
    applySnapshot(store, initialState);
  }

  return store;
}

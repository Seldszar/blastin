import "setimmediate";

import { applySnapshot } from "mobx-state-tree";
import { NextComponentType, NextPageContext } from "next";
import { createContext, useContext } from "react";
import uniqueString from "unique-string";

import { Store, StoreInstance } from "./models";

export * from "./models";

export const StoreContext = createContext<StoreInstance>(Store.create());
export const useStore = () => useContext<StoreInstance>(StoreContext);

export function withStore<P, C = NextPageContext>(ComposedComponent: NextComponentType<C, any, P>) {
  const WithStoreWrapper = (props: P) => {
    return (
      <StoreContext.Consumer>
        {(store) => <ComposedComponent store={store} {...props} />}
      </StoreContext.Consumer>
    );
  };

  WithStoreWrapper.displayName = `withStore(${
    ComposedComponent.displayName ?? ComposedComponent.name
  })`;

  WithStoreWrapper.getInitialProps = ComposedComponent.getInitialProps;
  WithStoreWrapper.origGetInitialProps = (ComposedComponent as any).origGetInitialProps;

  return WithStoreWrapper;
}

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

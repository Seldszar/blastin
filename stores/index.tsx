import "setimmediate"

import { applySnapshot } from "mobx-state-tree"
import { NextComponentType } from "next"
import { createContext, useContext } from "react"
import uniqueString from "unique-string"

import { Store, StoreInstance } from "./models"

export * from "./models"

export const StoreContext = createContext<StoreInstance>(null)
export const useStore = () => useContext<StoreInstance>(StoreContext)

export function withStore(WrappedComponent: NextComponentType) {
  function WithStoreWrapper(props) {
    return (
      <StoreContext.Consumer>
        {store => <WrappedComponent store={store} {...props} />}
      </StoreContext.Consumer>
    )
  }

  WithStoreWrapper.displayName = `withStore(${WrappedComponent.displayName || WrappedComponent.name})`

  WithStoreWrapper.getInitialProps = WrappedComponent.getInitialProps
  WithStoreWrapper.origGetInitialProps = (WrappedComponent as any).origGetInitialProps

  return WithStoreWrapper
}

let store: StoreInstance;

export function initializeStore(isServer: boolean, initialState?: object): StoreInstance {
  if (isServer) {
    store = Store.create()
  }

  if (store == null) {
    store = Store.create({
      filters: [
        {
          id: uniqueString(),
          icon: "Home",
          title: "All Events",
          query: ``
        },
        {
          id: uniqueString(),
          icon: "Cake",
          title: "Subscription Anniversaries",
          query: `type == "resub" and (data.cumulativeMonths % 12) == 0`
        },
        {
          id: uniqueString(),
          icon: "AddFavorite",
          title: "New Subscriptions",
          query: `type == "sub"`
        },
        {
          id: uniqueString(),
          icon: "Diamond",
          title: "Cheers",
          query: `type == "cheer"`
        },
        {
          id: uniqueString(),
          icon: "GiftboxOpen",
          title: "Subscription Gifts",
          query: `type == "subgift" or type == "anonsubgift" or type == "submysterygift"`
        },
        {
          id: uniqueString(),
          icon: "AddGroup",
          title: "Raids & Hosts",
          query: `type == "raid" or type == "host"`
        },
      ]
    })
  }

  if (initialState) {
    applySnapshot(store, initialState)
  }

  return store;
}

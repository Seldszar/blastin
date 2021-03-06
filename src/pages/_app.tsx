import { onSnapshot } from "mobx-state-tree";
import NextApp from "next/app";
import React from "react";

import { initializeStore, StoreInstance, StoreContext } from "@/stores";

import Container from "@/components/container";

import "@/assets/scss/global.scss";

export default class App extends NextApp {
  private readonly store: StoreInstance;

  constructor(props: any) {
    super(props);

    const isServer = typeof window === "undefined";
    const initialState = isServer ? undefined : JSON.parse(String(localStorage.getItem("store")));

    this.store = initializeStore(isServer, initialState);
  }

  componentDidMount(): void {
    onSnapshot(this.store, (snapshot) => {
      localStorage.setItem("store", JSON.stringify(snapshot));
    });
  }

  render(): JSX.Element {
    const { Component, pageProps } = this.props;
    const { Layout = ({ children }: any) => children } = Component as any;

    return (
      <StoreContext.Provider value={this.store}>
        <Container>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Container>
      </StoreContext.Provider>
    );
  }
}

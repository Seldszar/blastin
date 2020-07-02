import "mobx-react-lite/batchingForReactDom";

import { onSnapshot } from "mobx-state-tree";
import NextApp from "next/app";
import React from "react";

import { initializeStore, StoreInstance, StoreContext } from "stores";

import Container from "components/container";

import "assets/scss/global.scss";

export default class App extends NextApp {
  private readonly store: StoreInstance;

  constructor(props: any) {
    super(props);

    const isServer = typeof window === "undefined";
    const initialState = isServer ? undefined : JSON.parse(localStorage.getItem("store") ?? "");

    this.store = initializeStore(isServer, initialState);
  }

  componentDidMount() {
    onSnapshot(this.store, (snapshot) => {
      localStorage.setItem("store", JSON.stringify(snapshot));
    });
  }

  render() {
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

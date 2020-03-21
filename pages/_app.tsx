import { prepareClientPortals } from '@jesstelford/react-portal-universal'
import { onSnapshot } from 'mobx-state-tree'
import App from 'next/app'
import React from 'react'

import { initializeStore, StoreInstance, StoreContext } from '~/stores'

import Container from '~/components/Container'

import "~/assets/scss/global.scss"

if (typeof window !== 'undefined') {
  prepareClientPortals()
}

export default class extends App {
  private store: StoreInstance

  constructor(props) {
    super(props)

    const isServer = typeof window === 'undefined'
    const initialState = isServer ? undefined : JSON.parse(localStorage.getItem("store"))

    this.store = initializeStore(isServer, initialState)
  }

  componentDidMount() {
    onSnapshot(this.store, snapshot => {
      localStorage.setItem("store", JSON.stringify(snapshot))
    })
  }

  render() {
    const { Component, pageProps } = this.props
    const { Layout = ({ children }) => children } = Component as any

    return (
      <StoreContext.Provider value={this.store}>
        <Container>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Container>

        <div id="modal" />
      </StoreContext.Provider>
    )
  }
}

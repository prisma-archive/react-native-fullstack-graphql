import React from 'react'
import { AppRegistry } from 'react-native'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

import ListPage from './src/components/ListPage'

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'https://api.graph.cool/simple/v1/__PROJECT_ID__'}),
})

const App = () => (
  <ApolloProvider client={client}>
    <ListPage />
  </ApolloProvider>
)

AppRegistry.registerComponent('ReactNativeApolloInstagramExample', () => App);

import React from 'react'
import { AppRegistry } from 'react-native'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { nativeHistory, Route, Router, } from 'react-router-native'

import ListPage from './src/components/ListPage'
import CreatePage from './src/components/CreatePage'

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'https://api.graph.cool/simple/v1/__PROJECT_ID__'}),
})

const routes = (
  <ApolloProvider client={client}>
    <Router history={nativeHistory}>
      <Route path="/" component={ListPage} />
      <Route path="/create" component={CreatePage} />
    </Router>
  </ApolloProvider>
)

AppRegistry.registerComponent('ReactNativeApolloInstagramExample', () => () => routes);

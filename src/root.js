import React from 'react'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { nativeHistory, Route, Router, } from 'react-router-native'
import { checkUri } from './utils'

import ListPage from './components/ListPage'
import CreatePage from './components/CreatePage'

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'https://api.graph.cool/simple/v1/__PROJECT_ID__'}),
})

// this is only for better error messages
checkUri(client.networkInterface)

export default (
  <ApolloProvider client={client}>
    <Router history={nativeHistory}>
      <Route path="/" component={ListPage} />
      <Route path="/create" component={CreatePage} />
    </Router>
  </ApolloProvider>
)

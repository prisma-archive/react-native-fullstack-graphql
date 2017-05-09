import React from 'react'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { nativeHistory, Route, Router, } from 'react-router-native'
import { checkUri } from './utils'

import ListPage from './components/ListPage'
import CreatePage from './components/CreatePage'

// Paste your endpoint for the Simple API here.
// Info: https://github.com/graphcool-examples/react-native-apollo-instagram-example#2-create-graphql-api-with-graphcool
const networkInterface = createNetworkInterface({ uri: '__SIMPLE_API_ENDPOINT__' })

const client = new ApolloClient({networkInterface})

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

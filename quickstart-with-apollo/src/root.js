import React from 'react'
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo'
import ListPage from './components/ListPage'

// __SIMPLE_API_ENDPOINT_ looks similar to: `https://api.graph.cool/simple/v1/<PROJECT_ID>`
const networkInterface = createNetworkInterface({ uri: '__SIMPLE_API_ENDPOINT__' })
const client = new ApolloClient({ networkInterface })

export default (
  <ApolloProvider client={client}>
    <ListPage />
  </ApolloProvider>
)

import React from 'react'
import { ApolloProvider, ApolloClient, createNetworkInterface } from 'react-apollo'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'
import Chat from './Chat'

const graphQLEndpoint = '____SIMPLE_API_ENDPOINT__'
const subscriptionEndpoint = ''

// replace the placeholder __SIMPLE_API_ENDPOINT__ with your own endpoint,
// it looks similar to: https://api.graph.cool/simple/v1/__PROJECT_ID__
const networkInterface = createNetworkInterface({
  uri: '__SIMPLE_API_ENDPOINT__'
})

// replace the placeholder __SUBSCRIPTIONS_API_ENDPOINT__ with your own endpoint,
// it looks similar to: wss://subscriptions.graph.cool/v1/__PROJECT_ID__
const wsClient = new SubscriptionClient('__SUBSCRIPTIONS_API_ENDPOINT__', {
  reconnect: true
})

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
)

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  dataIdFromObject: o => o.id
})

export default class App extends React.Component {

  render() {
    return (
      <ApolloProvider client={client}>
        <Chat />
      </ApolloProvider>
    )
  }

}
import React from 'react'
import { Text, View } from 'react-native'
import { Constants } from 'expo'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'
import Home from './src/Components/Home'

const { manifest } = Constants
const url = manifest.debuggerHost
  .split(':')
  .shift()
  .concat(':4000')

const client = new ApolloClient({
  uri: `http://${url}`,
})

const App = () => (
  <ApolloProvider client={client}>
    <Home />
  </ApolloProvider>
)

export default App

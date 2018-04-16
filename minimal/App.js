import React from 'react';
import { Text, View } from 'react-native';
import Expo from "expo";
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import Home from './src/Components/Home';

const { manifest } = Expo.Constants;
const url = manifest.debuggerHost.split(':').shift().concat(':4000')

const client = new ApolloClient({
  uri: `http://${url}`,
})

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client} >
        <Home />
      </ApolloProvider>
    );
  }
}

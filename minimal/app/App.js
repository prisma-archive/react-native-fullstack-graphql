import React from 'react';
import { Text, View } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import Home from './src/Components/Home';

const client = new ApolloClient({
  uri: 'http://192.168.1.118:4000',
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

import Exponent from 'exponent'
import React from 'react'
import {StyleSheet, Text, View, Button, Linking, TouchableHighlight, AsyncStorage} from 'react-native'
import {ApolloProvider, ApolloClient, createNetworkInterface} from 'react-apollo'
import PostListView from './src/PostListView'
import PostDetailView from './src/PostDetailView'
import {createRouter, NavigationProvider, StackNavigation} from '@exponent/ex-navigation'

// Refer to the README that explains how to set the following variables

// replace `<Client Id>` with your personal Auth0 Client Id
export const auth0_client_id = '<Client Id>'

// replace `<Domain>` with your Auth0 Domain
export const authorize_url = 'https://<Domain>/authorize'

export let redirect_uri
if (Exponent.Constants.manifest.xde) {
  // replace `<Exponent URL without Port>` with the app's URL when you open it in exponent
  // without the colon and the port
  redirect_uri = '<Exponent URL without Port>/+/redirect'
} else {
  // this URL will be used when you publish your app
  redirect_uri = `${Exponent.Constants.linkingUri}/redirect`
}


const networkInterface = createNetworkInterface({
  uri: '__SIMPLE_API_ENDPOINT__',
})

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {}  // Create the header object if needed.
    }

    AsyncStorage.getItem('token').then(
      encodedToken => {
        req.options.headers['authorization'] = `Bearer ${encodedToken}`
        next()
      },
      failure => {
        console.error('ERROR: no token', failure)
        next()
      })
  }
}])

export const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: o => o.id,
})

const Router = createRouter(() => ({
  posts: () => PostListView,
  postDetails: () => PostDetailView,
}))

class App extends React.Component {

  render() {
    return (
      <ApolloProvider client={client}>
        <NavigationProvider router={Router}>
          <StackNavigation initialRoute='posts' />
        </NavigationProvider>
      </ApolloProvider>
    )
  }

}

Exponent.registerRootComponent(App)

export default Router
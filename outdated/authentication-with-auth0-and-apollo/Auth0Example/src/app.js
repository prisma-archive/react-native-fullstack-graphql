import React from 'react'
import { AsyncStorage } from 'react-native'
import { Actions, Scene, Router } from 'react-native-router-flux'
import { ApolloProvider, ApolloClient, createNetworkInterface } from 'react-apollo'

import Login from './components/login'
import Profile from './components/profile'

// __SIMPLE_API_ENDPOINT_ looks similar to: `https://api.graph.cool/simple/v1/<PROJECT_ID>`
const networkInterface = createNetworkInterface({
  uri: '__SIMPLE_API_ENDPOINT__'
})

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }

    AsyncStorage.getItem('token')
      .then((token) => {
        req.options.headers.authorization = `Bearer ${token}`
        next()
      })
      .catch((error) => {
        console.error(error)
        next()
      })
  }
}])

// Finally, create your ApolloClient instance with the modified network interface
const client = new ApolloClient({
  networkInterface
})

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="login" component={Login} title="Login" />
    <Scene key="profile" component={Profile} title="Profile" initial />
  </Scene>
)

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router scenes={scenes} />
      </ApolloProvider>
    )
  }
}

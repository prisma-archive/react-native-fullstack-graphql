import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import Relay, {
  Route,
  RootContainer,
} from 'react-relay'
import { StackNavigator, NavigationActions } from 'react-navigation'
import PokemonList from './components/PokemonList'
import PokemonDetails from './components/PokemonDetails'

Relay.injectNetworkLayer(
  // __RELAY_API_ENDPOINT_ looks similar to: `https://api.graph.cool/relay/v1/<PROJECT_ID>`
  new Relay.DefaultNetworkLayer('__RELAY_API_ENDPOINT_')
)

export class ViewerRoute extends Route {
  static queries = {
    viewer: () => Relay.QL`query { viewer }`
  }
  static routeName = 'ViewerRoute'
}

export class NodeRoute extends Route {
  static queries = {
    node: (Component, variables) => {
      return Relay.QL`query {
        node(id: $id) {
          ${Component.getFragment('node', variables)}
        }
      }`
    }
  }
  static routeName = 'NodeRoute'
}

const PokemonListRelayWrapper = (props) => (
  <Relay.RootContainer
    Component={PokemonList}
    route={new ViewerRoute()}
    renderFetched={(data) => {
          return (
            <PokemonList
              {...props}
              {...data}
            />
          )
        }}
    renderLoading={() => <Text>Loading</Text>}
    renderFailure={(error) => <Text>Error</Text>}
  />
)

const PokemonDetailsRelayWrapper = (props) => (
  <Relay.RootContainer
    Component={PokemonDetails}
    route={new NodeRoute({
      id: props.navigation.state.params.pokemonId
    })}
    renderFetched={(data) => {
          return (
            <PokemonDetails
              {...props}
              {...data}
            />
          )
        }}
    renderLoading={() => <Text>Loading</Text>}
    renderFailure={(error) => <Text>Error</Text>}
  />
)

const CreateNewPokemonRelayWrapper = (props) => (
  <Relay.RootContainer
    Component={PokemonDetails}
    route={new ViewerRoute()}
    renderFetched={(data) => {
          return (
            <PokemonDetails
              {...props}
              {...data}
            />
          )
        }}
    renderLoading={() => <Text>Loading</Text>}
    renderFailure={(error) => <Text>Error</Text>}
  />
)

const RootNavigationStack = StackNavigator({
  PokemonList: {
    screen: PokemonListRelayWrapper,
    navigationOptions: ({navigation}) => ({
      title: `Pokedex`,
      headerVisible: true,
      headerRight: (
        <Button
          title={'Add'}
          onPress={() => navigation.navigate('CreatePokemon')}
        />
      )
      // header: ({ navigate }) => {
      //   return {
      //     visible: true,
      //     right: (
      //       <Button
      //         title={'Add'}
      //         onPress={() => navigate('CreatePokemon')}
      //       />
      //     ),
      //   }}
    }),
  },
  PokemonDetails: {
    screen: PokemonDetailsRelayWrapper,
    path: 'details/:id',
    navigationOptions: ({navigation}) => ({
      title: navigation.state.params.pokemonName,
      headerVisible: true,
    }),
  }
}, {
  headerMode: 'screen'
})

const ModalStack = StackNavigator({
  RootNavigationStack: {
    screen: RootNavigationStack,
    navigationOptions: ({navigation}) => ({
      headerVisible: false,
    })
  },
  CreatePokemon: {
    path: '/create',
    screen: CreateNewPokemonRelayWrapper,
    navigationOptions: ({navigation}) => ({
      title: `New Pokemon`,
      headerVisible: true,
      headerLeft: (
        <Button
          title='Cancel'
          onPress={() => navigation.goBack()}
        />
      )
    }),
  }
},  {
  mode: 'modal'
})

export default class App extends React.Component {
  render() {
    return (
      <ModalStack />
    )
  }
}

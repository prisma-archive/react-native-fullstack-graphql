import React from 'react'
import { Text, View, ScrollView } from 'react-native'
import Relay, { Route } from 'react-relay'
import PokemonItem from './PokemonItem'

class PokemonList extends React.Component {

  render() {
    // console.log(this.props.viewer.allPokemons)
    return (
      <ScrollView>
        {this.props.viewer.allPokemons.edges.map(pokemonEdge => (
          <PokemonItem
            key={pokemonEdge.node.id}
            pokemon={pokemonEdge.node}
            itemSelected={(pokemonId, pokemonName) =>
              this.props.navigation.navigate('PokemonDetails', { pokemonId: pokemonId })}
          />
        ))}
      </ScrollView>
    )  }

}

export default Relay.createContainer(PokemonList, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        allPokemons(first: 10) {
          edges {
            node {
              id
              ${PokemonItem.getFragment('pokemon')}
            }
          }
        }
      }
    `
  }
})

import React from 'react'
import { Image, Text, View, TouchableHighlight, StyleSheet } from 'react-native'
import Relay from 'react-relay'

class PokemonItem extends React.Component {

  render() {

    // console.log('PokemonItem: ', this.props)

    return (
      <TouchableHighlight
        onPress={() => this.props.itemSelected(this.props.pokemon.id, this.props.pokemon.name)}
      >
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={{uri: this.props.pokemon.url}}
          />
          <Text style={styles.text}>{this.props.pokemon.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }

}

export default Relay.createContainer(PokemonItem, {
  fragments: {
    pokemon: () => Relay.QL`
      fragment PokemonDetails on Pokemon {
        id
        name
        url
      }
    `
  }
})

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    paddingLeft: 12,
  },
  image: {
    width: 60,
    height: 60,
  }
})
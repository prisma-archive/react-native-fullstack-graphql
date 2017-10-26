import React from 'react'
import { TextInput, View, Image, StyleSheet, Button } from 'react-native'
import Relay from 'react-relay'
import UpdatePokemonMutation from '../mutations/UpdatePokemonMutation'
import CreatePokemonMutation from '../mutations/CreatePokemonMutation'
import DeletePokemonMutation from '../mutations/DeletePokemonMutation'
import { NavigationActions } from 'react-navigation'

class PokemonDetails extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      pokemonName: props.node ? props.node.name : '',
      pokemonUrl: props.node ? props.node.url : ''
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{uri: this.state.pokemonUrl.length > 0 ? this.state.pokemonUrl : 'https://upload.wikimedia.org/wikipedia/en/3/39/Pokeball.PNG'}}
        />
        <View>
          <TextInput
            value={this.state.pokemonName}
            onChangeText={(newText) => this.setState({pokemonName: newText})}
            style={styles.textInput}
          />
          <TextInput
            value={this.state.pokemonUrl}
            onChangeText={(newText) => this.setState({pokemonUrl: newText})}
            style={styles.textInput}
          />
        </View>
        {this._renderCreateButton()}
        {this._renderUpdateButton()}
        {this._renderDeleteButton()}
      </View>
    )

  }

  _renderCreateButton = () => {
    if (this.props.viewer && this.state.pokemonName.length > 0 && this.state.pokemonUrl.length) {
      return (
        <Button
          title='Create'
          onPress={() => this._sendCreatePokemonMutation()}
        />
      )
    }
  }

  _renderUpdateButton = () => {
    if (this.props.node) {
      const {pokemonName, pokemonUrl} = this.state // values set by user
      const {name, url} = this.props.node // initial values
      return (
        <Button
          disabled={pokemonName === name && pokemonUrl === url}
          title='Update'
          onPress={() => this._sendUpdatePokemonMutation()}
        />
      )
    }
  }

  _renderDeleteButton = () => {
    if (this.props.node) {
      return (
        <Button
          color='red'
          title='Delete'
          onPress={() => this._sendDeletePokemonMutation()}
        />
      )
    }
  }


  _sendUpdatePokemonMutation = () => {
    const updatePokemonMutation = new UpdatePokemonMutation({
      pokemonId: this.props.node.id,
      pokemonName: this.state.pokemonName,
      pokemonUrl: this.state.pokemonUrl,
    })
    this.props.relay.commitUpdate(
      updatePokemonMutation,
      {
        onSuccess: response => {
          console.log('success: ', response)
          this.props.navigation.dispatch(NavigationActions.back())
        },
        onFailure: error => {
          console.log('error: ', error)
        }
      }
    )
  }

  _sendDeletePokemonMutation = () => {
    const deletePokemonMutation = new DeletePokemonMutation({
      pokemonId: this.props.node.id,
      // viewerId,
    })
    this.props.relay.commitUpdate(deletePokemonMutation, {
      onSuccess: response => this.props.navigation.goBack(),
      onFailure: error => console.log('Could not delete pokemon: ', error),
    })
  }

  _sendCreatePokemonMutation = () => {
    const createPokemonMutation = new CreatePokemonMutation({
      viewerId: this.props.viewer.id,
      pokemonName: this.state.pokemonName,
      pokemonUrl: this.state.pokemonUrl,
    })
    this.props.relay.commitUpdate(
      createPokemonMutation,
      {
        onSuccess: response => {
          console.log('success: ', response)
          this.props.navigation.dispatch(NavigationActions.back())
        },
        onFailure: error => {
          console.log('error: ', error)
        }
      }
    )
  }

}

export default Relay.createContainer(PokemonDetails, {
  fragments: {
    node: () => Relay.QL`
      fragment PokemonDetails on Node {
        ... on Pokemon {
          id
          name
          url
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
      }
    `
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 22,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 22,
  },
  textInput: {
    padding: 8,
    marginBottom: 12,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.25)',
    width: 260,
    height: 40,
  },

})
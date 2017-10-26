import Relay from 'react-relay'

export default class UpdatePokemonMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation {updatePokemon}`
  }

  getVariables() {
    const {pokemonId, pokemonName, pokemonUrl} = this.props
    return {
      id: pokemonId,
      name: pokemonName,
      url: pokemonUrl
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdatePokemonPayload {
        pokemon
      }
    `
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        pokemon: this.props.pokemonId,
      }
    }]
  }

}
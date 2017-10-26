import Relay from 'react-relay'

export default class DeletePokemonMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation { deletePokemon }`
  }

  getVariables() {
    return {
      id: this.props.pokemonId,
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeletePokemonPayload {
        pokemon
      }
    `
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'pokemon',
      connectionName: 'edge',
      deletedIDFieldName: 'deletedId'
    }]
  }

}
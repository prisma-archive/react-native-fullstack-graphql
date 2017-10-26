import Relay from 'react-relay'

export default class CreatePokemonMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation {createPokemon}`
  }

  getVariables() {
    const {pokemonName, pokemonUrl} = this.props
    return {
      name: pokemonName,
      url: pokemonUrl
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreatePokemonPayload {
        viewer {
          allPokemons
        }
      }
    `
  }

  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'viewer',
      parentID: this.props.viewerId,
      connectionName: 'allPokemons',
      edgeName: 'edge',
      rangeBehaviors: {
        '': 'append'
      }
    }]
  }

}
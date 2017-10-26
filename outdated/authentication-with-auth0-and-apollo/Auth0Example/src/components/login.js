import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'
import Auth0Lock from 'react-native-lock'
import { Button } from 'react-native-elements'
import { Actions, ActionConst } from 'react-native-router-flux'
import { ApolloClient, gql, graphql, withApollo } from 'react-apollo'
import { Wrapper } from './index'


// enter your Auth0 credentials
const AUTH0_CLIENT_ID = ''
const AUTH0_DOMAIN = ''

type Props = {
  client: ApolloClient,
  createUser: ({
    variables: {
      idToken: string,
      name: ?string
    }
  }) => { id: string }
}

class Login extends Component {
  _lock: Auth0Lock
  _showLogin: () => void

  props: Props

  constructor(props) {
    super(props)
    this._lock = new Auth0Lock({ clientId: AUTH0_CLIENT_ID, domain: AUTH0_DOMAIN })
    this._showLogin = this._showLogin.bind(this)
  }

  render() {
    return (
      <Wrapper>
        <Button onPress={this._showLogin} title="login" />
      </Wrapper>
    )
  }

  _showLogin() {
    this._lock.show({}, async (err, profile, token) => { //eslint-disable-line
      if (!err) {
        AsyncStorage.setItem('token', token.idToken)
          .then(() => this.props.client.resetStore())
        try {
          await this.props.createUser({
            variables: {
              idToken: token.idToken,
              name: profile.name
            }
          })
          Actions.profile({ type: ActionConst.REPLACE })
        } catch (e) {
          // User probably already exists - this logic needs to be improved
          Actions.profile({ type: ActionConst.REPLACE })
        }
      } else {
        console.error(err)
      }
    })
  }
}

const createUserMutation = gql`
  mutation createUser($idToken: String!, $name: String) {
    createUser(
      authProvider: {
        auth0: {
          idToken: $idToken
        }
      },
      name: $name
    ){  
      id
    }
  }`

export default withApollo(graphql(createUserMutation, { name: 'createUser' })(Login))

import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'
import { Text, Button, Grid, Row } from 'react-native-elements'
import { ApolloClient, graphql, withApollo, gql } from 'react-apollo'
import { Actions, ActionConst } from 'react-native-router-flux'

import { Wrapper } from './index'

type Props = {
  data: {
    loading: boolean,
    user: { id: string, name: ?string }
  },
  client: ApolloClient
}

class Profile extends Component {
  _logout: () => void

  static defaultProps = {
    data: { loading: true }
  }

  props: Props

  constructor(props: Props) {
    super(props)
    this._logout = () => {
      AsyncStorage.removeItem('token')
        .then(() => props.client.resetStore())
        .then(() => Actions.login({ type: ActionConst.REPLACE }))
    }
    if (!props.data.loading && !props.data.user) {
      Actions.login({ type: ActionConst.REPLACE })
    }
  }

  componentWillReceiveProps(newProps: Props) {
    if (!newProps.data.loading && !newProps.data.user) {
      Actions.login({ type: ActionConst.REPLACE })
    }
  }

  render() {
    if (this.props.data.loading) {
      return (
        <Wrapper>
          <Text h3>Loading...</Text>
        </Wrapper>
      )
    }

    if (!this.props.data.user) return null

    const { id, name } = this.props.data.user
    return (
      <Wrapper style={{ flex: 1 }}>
        <Grid>
          <Row style={{ alignItems: 'center' }}>
            <Text h3>{ name || id }</Text>
          </Row>
          <Row style={{ justifyContent: 'flex-end' }}>
            <Button onPress={this._logout} title="logout" />
          </Row>
        </Grid>
      </Wrapper>
    )
  }
}

const userQuery = gql`
  query userQuery {
    user {
      id
      name
    }
  }
`

export default withApollo(graphql(userQuery)(Profile))

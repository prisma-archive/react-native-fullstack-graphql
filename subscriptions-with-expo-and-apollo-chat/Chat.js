import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { AsyncStorage, Text, StyleSheet, View, ActivityIndicator } from 'react-native'
import generateStupidName from 'sillyname'
import { gql, graphql, compose } from 'react-apollo'

const CHAT_USER_NAME_KEY = 'CHAT_USER_NAME'
const CHAT_USER_ID_KEY = 'CHAT_USER_ID'

const createPerson = gql`
  mutation createPerson($name: String!) {
    createPerson(name: $name) {
      id
      name
    }
  }
`

const allMessages = gql`
  query allMessages {
    allMessages(last: 100, orderBy: createdAt_DESC) {
      id
      text
      createdAt
      sentBy {
        id
        name
      }
    }
  }
`

const createMessage = gql`
  mutation createMessage($text: String!, $sentById: ID!) {
    createMessage(text: $text, sentById: $sentById) {
      id
      text
      createdAt
      sentBy {
        id
        name
      }
    }
  }
`

const newMessageSubscription = gql`
  subscription {
    Message(filter: {
      mutation_in: [CREATED]
    }) {
      node {
        id
        text
        createdAt
        sentBy {
          id
          name
        }
      }
    }
  }
`


class Chat extends React.Component {

  state = {
    user: null,
    messages: []
  }

  async componentDidMount() {
    this._subscribeToNewMessages()
    await this._initUser()
  }

  render() {

    if (!this.state.user) {
      return (
        <View style={styles.container}>
          <Text>No user found.</Text>
        </View>
      )
    }

    if (this.props.allMessagesQuery.loading) {
      return (
        <View style={styles.container}>
          <Text>Loading messages ...</Text>
          <ActivityIndicator style={styles.loadingIndicator} />
        </View>
      )
    }

    const messages = this.props.allMessagesQuery.allMessages ?
      this.props.allMessagesQuery.allMessages.map(this._convertMessageToGiftedChatFormat) :
      []

    console.log(`Render messages: ${JSON.stringify(messages)}`)
    return (
      <GiftedChat
        messages={messages}
        onSend={this._onSend}
        user={this.state.user}
      />
    )
  }

  _onSend = (messages) => {
    const message = messages[0]
    const variables = { text: message.text, sentById: message.user._id }
    this.props.createMessageMutation({ variables })
  }

  _initUser = async () => {
    let id = await AsyncStorage.getItem(CHAT_USER_ID_KEY)
    let name = await AsyncStorage.getItem(CHAT_USER_NAME_KEY)
    if (!id || !name) {
      name = generateStupidName()
      const result = await this.props.createPersonMutation({
        variables: { name }
      })
      await AsyncStorage.setItem(CHAT_USER_NAME_KEY, result.data.createPerson.name)
      await AsyncStorage.setItem(CHAT_USER_ID_KEY, result.data.createPerson.id)
    }
    console.log(`User: ${name} (${id})`)
    this.setState({
      user: {_id: id, name}
    })
  }

  _subscribeToNewMessages = () => {
    this.createMessageSubscription = this.props.allMessagesQuery.subscribeToMore({
      document: newMessageSubscription,
      updateQuery: (previousState, {subscriptionData}) => {
        const newMessage = subscriptionData.data.Message.node
        const messages = [newMessage].concat(previousState.allMessages)
        return {
          allMessages: messages
        }
      },
      onError: (err) => console.error(err),
    })
  }

  _convertMessageToGiftedChatFormat = (message) => {
    return {
      _id: message.id,
      user: {
        _id: message.sentBy.id,
        name: message.sentBy.name
      },
      text: message.text,
      createdAt: message.createdAt
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingIndicator: {
    marginTop: 16,
  }
})

export default compose(
  graphql(createPerson, { name: 'createPersonMutation' }),
  graphql(createMessage, { name: 'createMessageMutation' }),
  graphql(allMessages, {name: 'allMessagesQuery'})
)(Chat)


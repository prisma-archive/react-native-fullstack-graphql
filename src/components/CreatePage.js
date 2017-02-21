import React from 'react'
import { withRouter } from 'react-router-native'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { View, TextInput, Button, Image, Text } from 'react-native'

class CreatePage extends React.Component {

  static propTypes = {
    router: React.PropTypes.object,
    mutate: React.PropTypes.func,
  }

  state = {
    description: '',
    imageUrl: '',
  }

  render () {

    return (
      <View>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({description: text})}
          placeholder={'Description'}
        />
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({imageUrl: text})}
          placeholder={'Image Url'}
        />
        {this.renderImage()}
        {this.renderButton()}
      </View>
    )
  }

  renderButton() {
    if (this.state.description && this.state.imageUrl) {
      return (
        <Button title={'Post'} onPress={this.handlePost} />
      )
    }

    return null
  }

  renderImage() {
    if (this.state.imageUrl) {
      return (
        <Image
          source={{ uri: this.state.imageUrl }}
          style={{width: 200, height: 200}}
        />
      )
    }
    return null
  }

  handlePost = () => {
    const {description, imageUrl} = this.state
    this.props.mutate({variables: {description, imageUrl}})
      .then(() => {
        this.props.router.replace('/')
      })
  }
}

const addMutation = gql`
  mutation ($description: String!, $imageUrl: String!){
    createPost(description: $description, imageUrl: $imageUrl) {
      id
    }
  }
`

const PageWithMutation = graphql(addMutation)(withRouter(CreatePage))

export default PageWithMutation

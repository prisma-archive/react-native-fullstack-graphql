import React from 'react'
import { View, Image, Text } from 'react-native'


export default class Post extends React.Component {

  static propTypes = {
    post: React.PropTypes.object,
  }

  render () {
    return (
      <View style={{flex: 1, width: 200, height: 200}}>
        <Image
          source={{ uri: this.props.post.imageUrl }}
          style={{flex: 1}}
        />
        <Text>{this.props.post.description}</Text>
      </View>
    )
  }
}
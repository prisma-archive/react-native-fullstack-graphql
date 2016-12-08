import React from 'react'
import { View, Image, Text } from 'react-native'


export default class Post extends React.Component {

  static propTypes = {
    post: React.PropTypes.object,
  }

  render () {
    return (
      <View style={{flex: 1, width: 150, height: 150}}>
        <Image
          source={{ uri: this.props.post.imageUrl }}
          style={{flex: 1, width: 150, height: 150}}
        />
        <Text>{this.props.post.description}</Text>
      </View>
    )
  }
}

import React from 'react'
import { Image } from 'react-native'


export default class Post extends React.Component {

  static propTypes = {
    post: React.PropTypes.object,
  }

  render () {
    return (
        <Image
          source={{ uri: this.props.post.imageUrl }}
          style={{flex: 1, width: 200, height: 200}}
        />
    )
  }
}
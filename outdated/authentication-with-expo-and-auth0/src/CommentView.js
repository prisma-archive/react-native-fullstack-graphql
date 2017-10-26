import React from 'react'
import {Font} from 'exponent'
import {Text, View, Image, Dimensions, StyleSheet, TouchableHighlight} from 'react-native'
import {timeDifference} from './utils'

export default class CommentView extends React.Component {

  state = {
    fontLoaded: false,
  }

  async componentDidMount() {
    // load font
    await Font.loadAsync({
      'open-sans-regular': require('../assets/fonts/OpenSans-Regular.ttf'),
      'open-sans-semibold': require('../assets/fonts/OpenSans-Semibold.ttf'),
    })
    this.setState({fontLoaded: true})
  }

  render() {

    const createdAtTimestamp = new Date(this.props.createdAt).getTime()
    const nowTimestamp = new Date().getTime()
    const ago = timeDifference(nowTimestamp, createdAtTimestamp)

    return  this.state.fontLoaded ?
        (<View style={styles.container}>
          <View style={styles.infoLine}>
            <Text style={styles.author}>{String(this.props.user).toUpperCase()}</Text>
            <Text style={styles.date}>{ago}</Text>
          </View>
          <Text style={styles.comment}>{this.props.comment}</Text>
        </View>)
        :
        (<View />)
  }

}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 38,
  },
  infoLine: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  author: {
    fontSize: 14,
    color: 'rgba(42,126,211,1)',
    fontFamily: 'open-sans-semibold',
  },
  date: {
    fontSize: 14,
    color: 'rgba(0,0,0,.3)',
    fontFamily: 'open-sans-semibold',
  },
  comment: {
    fontSize: 16,
    color: 'rgba(0,0,0,.5)',
    fontFamily: 'open-sans-regular',
    marginTop: 8,
    paddingHorizontal: 8,
  },
})

CommentView.PropTypes = {
  user: React.PropTypes.string,
  comment: React.PropTypes.string,
  createdAt: React.PropTypes.string,
}

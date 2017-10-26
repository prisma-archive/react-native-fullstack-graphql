import React from 'react'
import {Text, View, Image, Dimensions, StyleSheet, TouchableHighlight} from 'react-native'
import {Font} from 'exponent'

export default class ListViewFooter extends React.Component {

  state = {
    fontLoaded: false,
  }

  async componentDidMount() {
    await Font.loadAsync({
      'open-sans-regular': require('../assets/fonts/OpenSans-Regular.ttf'),
    })
    this.setState({ fontLoaded: true })
  }

  render() {

    if (!this.state.fontLoaded) {
      return (
        <View></View>
      )
    }

    return this.props.loggedIn ?
        <View style={styles.loggedInContainer}>
          <TouchableHighlight
            onPress={() => this.props.onCreateNewPost()}
          >
            <Text style={styles.buttonText}>Create new post</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => this.props.onLogout()}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableHighlight>
        </View>
        :
        <View style={styles.signInContainer}>
          <TouchableHighlight
            onPress={() => this.props.onSignIn()}
          >
            <Text style={styles.buttonText}>Sign in to create a post</Text>
          </TouchableHighlight>
        </View>
  }

}

const styles = StyleSheet.create({
  loggedInContainer: {
    height: 44,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(42,126,211,1)',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  signInContainer: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(42,126,211,1)',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'open-sans-regular'
  }
})

ListViewFooter.PropTypes = {
  loggedIn: React.PropTypes.bool,
  onSignIn: React.PropTypes.func,
  onLogout: React.PropTypes.func,
  onCreateNewPost: React.PropTypes.func,
}
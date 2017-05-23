import React from 'react'
import {Font} from 'exponent'
import {Text, View, Image, Dimensions, StyleSheet, TouchableHighlight} from 'react-native'


export default class PostItem extends React.Component {

  state = {
    fontLoaded: false,
    width: 0,
    height: 0,
  }

  async componentDidMount() {

    Image.getSize(this.props.imageUrl, (width, height) => {
      const imageHeight =  250

      const scaleFactor = height / imageHeight
      const imageWidth = width / scaleFactor

      this.setState({width: imageWidth, height: imageHeight})
    })

    await Font.loadAsync({
      'open-sans-light': require('../assets/fonts/OpenSans-Light.ttf'),
    })
    this.setState({ fontLoaded: true })
  }

  render() {

    const {width, height} = this.state
    const {description, imageUrl, comments, postId, createdBy} = this.props
    return (
      <TouchableHighlight
        onPress={() => this.props.onSelect({
          'description': description,
          'imageUrl': imageUrl,
          'comments': comments,
          'postId': postId,
          'createdBy': createdBy,
        })}
      >
        <View>
          <View style={styles.imageContainer}>
            <Image
              style={{width, height}}
              source={{uri: this.props.imageUrl}}
              resizeMode='contain'
            />
          </View>
          {this.state.fontLoaded &&
          <View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {this.props.description}
              </Text>
            </View>
          </View>
          }
        </View>
      </TouchableHighlight>
    )
  }

}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.07)'
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 25,
  },
  title: {
    fontFamily: 'open-sans-light',
    color: 'rgba(0,0,0,.8)',
    fontWeight: '300',
    fontSize: 20,
  },
})

PostItem.propTypes = {
  description: React.PropTypes.string,
  imageUrl: React.PropTypes.string,
  onSelect: React.PropTypes.func,
}
import React from 'react'
import {Text, View, Image, Dimensions, StyleSheet, TextInput, TouchableHighlight} from 'react-native'
import {Font} from 'exponent'
import {graphql, gql} from 'react-apollo'

const createPostMutation = gql`
    mutation createPost($description: String!, $imageUrl: String!, $createdById: ID!) {
        createPost(description: $description, imageUrl: $imageUrl, createdById: $createdById) {
            description
            imageUrl
            createdAt
            createdBy {
                name
            }
        }
    }
`;


class CreatePostView extends React.Component {

  state = {
    fontLoaded: false,
    imageUrl: '',
    description: '',
  }

  async componentDidMount() {
    await Font.loadAsync({
      'open-sans-regular': require('../assets/fonts/OpenSans-Regular.ttf'),
      'open-sans-light': require('../assets/fonts/OpenSans-Light.ttf'),
    })
    this.setState({ fontLoaded: true })
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.addImageContainer}>
          <View style={styles.addImage}>
            <View style={styles.photoPlaceholderContainer}>
              {
                this.state.imageUrl.length > 0 ?
                  <Image
                    source={{uri: this.state.imageUrl}}
                    style={{height: 80, width: 80}}
                    resizeMode='contain'
                  />
                  :
                  <View style={styles.photoPlaceholder} />
              }
            </View>
            {this.state.fontLoaded &&
            <TextInput
              style={styles.imageUrlInput}
              placeholder='Paste your image URL here...'
              onChangeText={(text) => this.setState({imageUrl: text})}
              value={this.state.imageUrl}
              placeholderTextColor='rgba(42,126,211,.5)'
            />}
          </View>
        </View>

        {this.state.fontLoaded &&
        <TextInput
          style={styles.descriptionInput}
          placeholder='Type a description...'
          onChangeText={(text) => this.setState({description: text})}
          value={this.state.description}
        />}

        {this.state.fontLoaded &&
        <View style={styles.buttons}>
          <TouchableHighlight
            style={styles.cancelButton}
            onPress={() => this.props.onComplete()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.saveButton}
            onPress={() => this._createPost()}
          >
            <Text style={styles.saveButtonText}>Create Post</Text>
          </TouchableHighlight>
        </View>}
      </View>
    )

  }

  _createPost = () => {
    const {description, imageUrl} = this.state
    const createdById = this.props.userId
    this.props.mutate({variables: { description, imageUrl, createdById }})
      .then(() => {
        this.props.onComplete()
      })
  }

}

const CreatePostViewWithMutation = graphql(createPostMutation)(CreatePostView)
export default CreatePostViewWithMutation

CreatePostView.propTypes = {
  onComplete: React.PropTypes.func,
  mutate: React.PropTypes.func,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: 'rgba(255,255,255,1)'
  },
  addImageContainer: {
    backgroundColor: 'rgba(0,0,0,.03)',
  },
  addImage: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  photoPlaceholderContainer: {
    alignItems: 'center',
    height: 80,
  },
  photoPlaceholder: {
    backgroundColor: 'rgba(42,126,211,.1)',
    height: 80,
    width: 80,
  },
  imageUrlInput: {
    color: 'rgba(42,126,211,1)',
    height: 60,
    fontFamily: 'open-sans-regular',
  },
  descriptionInput: {
    paddingHorizontal: 20,
    height: 100,
    fontFamily: 'open-sans-light',
    fontSize: 20,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  saveButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(39,174,96,1)',
    height: 45,
    borderRadius: 2,
  },
  saveButtonText: {
    color: 'white',
    fontFamily: 'open-sans-regular',
  },
  cancelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  cancelButtonText: {
    color: 'rgba(0,0,0,.5)',
    fontFamily: 'open-sans-regular',
  },
})

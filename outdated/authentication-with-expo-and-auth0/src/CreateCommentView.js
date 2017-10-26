import React from 'react'
import {Font} from 'exponent'
import {Text, View, Image, Dimensions, StyleSheet, TouchableHighlight, TextInput} from 'react-native'
import {graphql, gql} from 'react-apollo'

const createCommentMutation = gql`
    mutation createComment($content: String!, $postId: ID!, $authorId: ID!) {
        createComment(content: $content, postId: $postId, authorId: $authorId) {
            id
            content
            createdAt
            author {
                name
            }
        }
    }
`

const horizontalMargin = 12

class CreateCommentView extends React.Component {

  state = {
    fontLoaded: false,
    content: '',
  }

  async componentDidMount() {
    // load font
    await Font.loadAsync({
      'open-sans-light': require('../assets/fonts/OpenSans-Light.ttf'),
      'open-sans-regular': require('../assets/fonts/OpenSans-Regular.ttf'),
      'open-sans-semibold': require('../assets/fonts/OpenSans-Semibold.ttf'),
    })
    this.setState({fontLoaded: true})
  }

  render() {

    const imageMargin = 8

    const imageHeight = 125
    const scaleFactor = this.props.imageHeight / imageHeight
    const imageWidth = this.props.imageWidth / scaleFactor

    return (
      <View style={styles.container}>
        <Image
          source={{uri: this.props.imageUrl}}
          style={{width: imageWidth, height: imageHeight, marginVertical: imageMargin, borderRadius: 2}}
        />
        {this.state.fontLoaded &&
        <Text style={styles.author}>posted by {String(this.props.createdBy).toUpperCase()}</Text>
        }
        {this.state.fontLoaded &&
        <TextInput
          style={styles.commentInput}
          placeholder='Enter a comment...'
          onChangeText={(text) => this.setState({content: text})}
          value={this.state.content}
          autoFocus={true}
          multiline={true}
        />
        }
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
            onPress={() => this._saveComment()}
          >
            <Text style={styles.saveButtonText}>Save Comment</Text>
          </TouchableHighlight>
        </View>
        }
      </View>
    )
  }

  _saveComment = () => {
    const {content} = this.state
    const {userId, postId} = this.props
    console.log(content, userId, postId)
    const authorId = userId
    this.props.mutate({
      variables: { content, postId, authorId },
      // not working :(
      updateQueries: {
        allPosts: (previousQueryResult, { mutationResult }) => {
          const newPosts = previousQueryResult.allPosts.slice()
          const post = newPosts.find(post => post.id === postId)
          return {
            allPosts: newPosts,
          }
        }
      },
    }).then((result) => {
        this.props.onComplete()
      })
  }

}


const CreateCommentViewWithMutation = graphql(createCommentMutation)(CreateCommentView)
export default CreateCommentViewWithMutation

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(247,247,247,1)',
    marginTop: 22,
    marginBottom: 16,
    paddingTop: 42,
    marginHorizontal: horizontalMargin,
    borderRadius: 12,
  },
  author: {
    fontSize: 14,
    color: 'rgba(42,126,211,1)',
    fontFamily: 'open-sans-semibold',
  },
  commentInput: {
    height: 200,
    marginVertical: 20,
    marginHorizontal: 16,
    fontSize: 20,
    fontFamily: 'open-sans-light',
    color: 'rgba(0,0,0,.6)',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
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

CreateCommentView.PropTypes = {

}




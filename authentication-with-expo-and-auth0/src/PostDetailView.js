import React from 'react'
import {Font} from 'exponent'
import {Text, View, ScrollView, Image, Dimensions, StyleSheet, TouchableHighlight, Modal} from 'react-native'
import CommentView from './CommentView'
import CreateCommentView from './CreateCommentView'
import {graphql, gql} from 'react-apollo'

const allCommentsQuery = gql`
    query allComments($postId: ID!) {
      allComments(filter: {
        post: {
          id: $postId
        }
      })
      {
        id
        createdAt
        content
        author {
            id
            name
        }
      }
    }
`

class PostDetailView extends React.Component {

  state = {
    fontLoaded: false,
    width: 0,
    height: 0,
    modalVisible: false,
  }

  static route = {
    navigationBar: {
      title: 'Post Details',
    }
  }


  async componentDidMount() {

    Image.getSize(this.props.route.params.post.imageUrl, (width, height) => {

      const screenWidth = Dimensions.get('window').width

      const scaleFactor = width / screenWidth
      const imageHeight = height / scaleFactor

      this.setState({width: screenWidth, height: imageHeight})
    })

    // load font
    await Font.loadAsync({
      'open-sans-light': require('../assets/fonts/OpenSans-Light.ttf'),
    })
    this.setState({fontLoaded: true})
  }

  render() {

    const {data} = this.props

    const {width, height} = this.state
    const sortedComments = this.props.data && this.props.data.allComments ? this.props.data.allComments.slice() : []
    sortedComments.sort((p1, p2) => new Date(p2.createdAt).getTime() - new Date(p1.createdAt).getTime())

    return (
      <ScrollView style={styles.container}>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalVisible}
        >
          <CreateCommentView
            onComplete={() => {
              this.props.data.refetch()
              this.setState({modalVisible: false})
            }}
            imageUrl={this.props.route.params.post.imageUrl}
            imageWidth={this.state.width}
            imageHeight={this.state.height}
            createdBy={this.props.route.params.post.createdBy}
            postId={this.props.route.params.post.postId}
            userId={this.props.route.params.userId}
          />
        </Modal>
        <Image
          style={{width: width, height: height}}
          source={{uri: this.props.route.params.post.imageUrl}}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {this.props.route.params.post.description}
          </Text>
        </View>
        <View style={styles.commentContainer}>
          {this.props.route.params.userId &&
          <View
            style={styles.newCommentButtonContainer}
          >
            <TouchableHighlight
              onPress={() => this._addComment()}
            >
              <Image
                style={styles.newCommentButton}
                source={require('../assets/img/comments.png')}
              />
            </TouchableHighlight>
          </View>
          }
          {sortedComments.map((comment, i) => {
            return (<CommentView
              key={i}
              user={comment.author.name}
              comment={comment.content}
              createdAt={comment.createdAt}
            />)
          })}
        </View>
      </ScrollView>
    )
  }

  _addComment = () => {
    this.setState({modalVisible: true})
  }

}

const postDetailViewWithQueries = graphql(allCommentsQuery, {
  options: (ownProps) => ({
    variables: {
      postId: ownProps.route.params.post.postId,
    }
  })
})(PostDetailView)
export default postDetailViewWithQueries

const styles = StyleSheet.create({
  container: {
  },
  titleContainer: {
    height: 100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    color: 'rgba(0,0,0,.8)',
    fontWeight: '300',
    fontSize: 20,
    marginHorizontal: 12,
  },
  commentContainer: {
    backgroundColor: 'rgba(0,0,0,.03)',
    paddingBottom: 8,
  },
  newCommentButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  newCommentButton: {
    width: 25,
    height: 25,
  }
})

PostDetailView.propTypes = {
}


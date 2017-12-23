import React from 'react'
import Post from './Post'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {
  View,
  TouchableHighlight,
  ListView,
  Modal,
  StyleSheet,
  Text,
} from 'react-native'
import CreatePage from './CreatePage'

class ListPage extends React.Component {
  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      dataSource: ds.cloneWithRows([]),
      modalVisible: false,
      user: undefined,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.feedQuery.loading && !nextProps.feedQuery.error) {
      const { dataSource } = this.state
      this.setState({
        dataSource: dataSource.cloneWithRows(nextProps.feedQuery.allPosts),
      })
    }
  }

  render() {
    if (this.props.feedQuery.loading) {
      return <Text>Loading</Text>
    }

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <CreatePage
            onComplete={() => {
              this.props.feedQuery.refetch()
              this.setState({ modalVisible: false })
            }}
          />
        </Modal>

        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={post => (
            <Post description={post.description} imageUrl={post.imageUrl} />
          )}
        />
        <TouchableHighlight
          style={styles.createPostButtonContainer}
          onPress={this._createPost}
        >
          <Text style={styles.createPostButton}>Create Post</Text>
        </TouchableHighlight>
      </View>
    )
  }

  _createPost = () => {
    // this.props.router.push('/create');
    this.setState({ modalVisible: true })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  createPostButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  createPostButton: {
    backgroundColor: 'rgba(39,174,96,1)',
    color: 'white',
    textAlign: 'center',
    fontSize: 22,
    height: 60,
    width: 480,
    paddingTop: 18,
  },
})

const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      id
      imageUrl
      description
    }
  }
`

export default graphql(FEED_QUERY, {
  name: 'feedQuery', // name of the injected prop: this.props.feedQuery...
  options: {
    fetchPolicy: 'network-only',
  },
})(ListPage)

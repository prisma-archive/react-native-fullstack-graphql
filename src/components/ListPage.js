import React from 'react'
import Post from './Post'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { ScrollView, View, Text, Button } from 'react-native'

class ListPage extends React.Component {

  static propTypes = {
    data: React.PropTypes.object,
  }

  render () {
    if (this.props.data.loading) {
      console.log('LOADING')
      return (<Text>Loading</Text>)
    }

    console.log('DONE LOADING', this.props.data.allPosts.length)

    return (
      <View>
        <ScrollView>
          <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
              {this.props.data.allPosts.reverse().map((post) =>
                <Post key={post.id} post={post} />
              )}
          </View>
        </ScrollView>
        <Button
          onPress={this.onPressLearnMore}
          title="Learn More"
        />
      </View>
    )
  }

  onPressLearnMore = () => {
    console.log('no')
  }
}

const FeedQuery = gql`query { allPosts { id imageUrl description } }`

const ListPageWithData = graphql(FeedQuery, {options: { pollInterval: 1000 } })(ListPage)

export default ListPageWithData

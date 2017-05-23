import {graphql, compose, gql} from 'react-apollo'
import React from 'react'
import {Text, View, ListView, StyleSheet, Modal, TouchableHighlight, Linking, AsyncStorage} from 'react-native'
import PostItem from './PostItem'
import CreatePostView from './CreatePostView'
import Exponent from 'exponent'
import jwtDecoder from 'jwt-decode'
import Router, {redirect_uri, auth0_client_id, authorize_url, client} from '../main'
import ListViewFooter from './ListViewFooter'

const allPostsQuery = gql`
    query allPosts {
        allPosts {
            id
            description
            imageUrl
            createdAt
            createdBy {
                name
            }
        }
    }
`

const currentUserQuery = gql`
    query currentUser {
        user {
            id
            name
        }
    }
`

const createUserMutation = gql`
    mutation createUser($encodedToken: String!, $username: String!) {
        createUser(
        authProvider: {
        auth0: {
        idToken: $encodedToken
        }
        }
        name: $username
        )
        {
            id
            name
        }
    }`

class PostListView extends React.Component {

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows([]),
      modalVisible: false,
      user: undefined,
    }

  }

  componentDidMount() {

    // handle redirects after auth0 authentication
    Linking.addEventListener('url', this._handleAuth0Redirect)

    // check if a user already exists
    client.query({query: currentUserQuery}).then(
      result => {
        if (result.data.user) {
          this.setState({
            user: {
              name: result.data.user.name,
              id: result.data.user.id,
            }
          })
        }
      }
    )
  }

  componentWillReceiveProps(nextProps) {

    // update posts
    if (nextProps.fetchAllPosts.allPosts) {
      const sortedPosts = nextProps.fetchAllPosts.allPosts.slice()
      sortedPosts.sort((p1, p2) => new Date(p2.createdAt).getTime() - new Date(p1.createdAt).getTime())

      const posts = sortedPosts.map(post => {
        return {
          'postId': post.id,
          'description': post.description,
          'imageUrl': post.imageUrl,
          'createdBy': post.createdBy.name,
        }
      })

      if (!nextProps.fetchAllPosts.loading && !nextProps.fetchAllPosts.error) {
        const {dataSource} = this.state
        this.setState({
          dataSource: dataSource.cloneWithRows(posts),
        })
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1, paddingTop: 22}}>

        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.modalVisible}
        >
          <CreatePostView
            userId={this.state.user && this.state.user.id}
            onComplete={() => {
              this.props.fetchAllPosts.refetch()
              this.setState({modalVisible: false})
            }}
          />
        </Modal>

        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(post) => {
            return (<PostItem
              description={post.description}
              imageUrl={post.imageUrl}
              comments={post.comments}
              postId={post.postId}
              createdBy={post.createdBy}
              onSelect={this._onRowSelected}
            />)
          }}
        />
        <ListViewFooter
          loggedIn={Boolean(this.state.user)}
          onSignIn={() => this._loginWithAuth0()}
          onLogout={() => {
            AsyncStorage.clear()
            this.setState({
              ...this.state,
              user: undefined,
            })
          }}
          onCreateNewPost={() => this._addButtonPressed()}
        />
      </View>
    )
  }

  _addButtonPressed() {
    this.setState({modalVisible: true})
  }

  _onRowSelected = (post) => {
    this.props.navigator.push(Router.getRoute('postDetails', {
      post: post,
      userId: this.state.user && this.state.user.id,
    }))
  }

  _loginWithAuth0 = async () => {
    const redirectionURL = authorize_url + this._toQueryString({
        client_id: auth0_client_id,
        response_type: 'token',
        scope: 'openid name',
        redirect_uri,
        state: redirect_uri,
      })
    Exponent.WebBrowser.openBrowserAsync(redirectionURL)
  }

  _handleAuth0Redirect = async (event) => {
    if (!event.url.includes('+/redirect')) {
      return
    }
    Exponent.WebBrowser.dismissBrowser()
    const [, queryString] = event.url.split('#')
    const responseObj = queryString.split('&').reduce((map, pair) => {
      const [key, value] = pair.split('=')
      map[key] = value // eslint-disable-line
      return map
    }, {})
    const encodedToken = responseObj.id_token
    const decodedToken = jwtDecoder(encodedToken)
    const username = decodedToken.name

    AsyncStorage.setItem('token', encodedToken).then(
      result => {

        this.props.fetchCurrentUser.refetch().then(
          result => {
            if (result.data.user) {
              this.setState({
                user: {
                  name: result.data.user.name,
                  id: result.data.user.id,
                }
              })
            } else {
              this.props.createUser(
                {
                  variables:
                  {
                    encodedToken,
                    username,
                  }
                }
              ).then(
                result => {
                  this.setState({
                    user: {
                      name: result.data.createUser.name,
                      id: result.data.createUser.id,
                    }
                  })
                },
                failure => {
                  console.error('ERROR: could not create user: ', failure)
                }
              )
            }
          },
          failure => {
            console.error('ERROR: failed asking for current user: ', failure)
          }
        )
      },
      failure => {
        console.error('ERROR: could not store token in AsyncStorage')
      }
    )
  }

  _toQueryString(params) {
    return '?' + Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
  }

}

export default compose(
  graphql(allPostsQuery, { name: 'fetchAllPosts' }),
  graphql(createUserMutation, { name: 'createUser' }),
  graphql(currentUserQuery, { name: 'fetchCurrentUser' }),
)(PostListView)

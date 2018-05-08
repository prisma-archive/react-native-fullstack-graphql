import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import InputName from './InputName'

const Home = () => (
  <View style={styles.container}>
    <Query query={HELLO_QUERY}>
      {props => {
        const { data, error, loading, refetch } = props
        if (error) {
          return <Text>An unexpected error occurred</Text>
        }
        if (loading) {
          return <Text>loading</Text>
        }
        return (
          <View>
            <Text>What's your name?</Text>
            <InputName
              onSubmit={name => {
                refetch({ name })
              }}
            />
            <Text>{data.hello}</Text>
          </View>
        )
      }}
    </Query>
  </View>
)

const HELLO_QUERY = gql`
  query HelloQuery($name: String) {
    hello(name: $name)
  }
`

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

# Expo & Apollo Quickstart

* [Expo](https://expo.io/): React Native toolchain to build native apps with Javascript and React
* [React Native](https://facebook.github.io/react-native/): Javascript framework for building native mobile apps with [React](https://facebook.github.io/react/)
* [Apollo Client](https://github.com/apollographql/apollo-client): Fully-featured, production ready caching GraphQL client
* [Graphcool](https://www.graph.cool): Flexible backend platform combining GraphQL + AWS Lambda

![](https://camo.githubusercontent.com/16899577cd7900f79f765d0689ff7664cf704ea5/687474703a2f2f696d6775722e636f6d2f547036356d45632e676966)

## Quickstart

For more information on how to get started [refer to the full react-native-apollo-instagram tutorial](https://www.graph.cool/docs/quickstart/react-native-apollo-instagram-example).

### 1. Clone example repository

```sh
git clone https://github.com/graphcool-examples/react-native-graphql.git
cd react-native-graphql/quickstart-with-expo-and-apollo
```

### 2. Create GraphQL API with [`graphcool`](https://www.npmjs.com/package/graphcool)

```sh
# Install Graphcool CLI
npm install -g graphcool

# Create a new project based on the Instagram schema
graphcool init --schema https://graphqlbin.com/instagram.graphql 
```

This creates a GraphQL API for the following schema:

```graphql
type Post {
  description: String!
  imageUrl: String!
}
```

### 3. Connect the app with your GraphQL API

Copy the `Simple API` endpoint to `./src/root.js` as the `uri` argument in the `createNetworkInterface` call:

```js
// replace `__SIMPLE_API_ENDPOINT__` with the endpoint from the previous step
const networkInterface = createNetworkInterface({ uri: '__SIMPLE_API_ENDPOINT__' })
```

### 4. Install depdendencies & run locally

```sh
yarn install
yarn start
```

Note that you can also run the app in a simulator by using the [XDE](https://github.com/expo/xde).

## Next steps

* [Advanced GraphQL features](https://www.graph.cool/docs/tutorials/advanced-features-eath7duf7d/)
* [Authentication & Permissions](https://www.graph.cool/docs/reference/authorization/overview-iegoo0heez/)
* [Implementing business logic with serverless functions](https://www.graph.cool/docs/reference/functions/overview-boo6uteemo/)


## Help & Community [![Slack Status](https://slack.graph.cool/badge.svg)](https://slack.graph.cool)

Join our [Slack community](http://slack.graph.cool/) if you run into issues or have questions. We love talking to you!

![](http://i.imgur.com/5RHR6Ku.png)

# Subscriptions Example (with React Native & Apollo)

* [Expo](https://expo.io/): React Native toolchain to build native apps with Javascript and React
* [React Native](https://facebook.github.io/react-native/): Javascript framework for building native mobile apps with [React](https://facebook.github.io/react/)
* [Apollo Client](https://github.com/apollographql/apollo-client): Fully-featured, production ready caching GraphQL client
* [Graphcool](https://www.graph.cool): Flexible backend platform combining GraphQL + AWS Lambda


## Getting Started

Subscriptions allow you to bring realtime functionality into your app. You can learn more about subscriptions in our [docs](https://www.graph.cool/docs/reference/simple-api/subscriptions-aip7oojeiv/).

### 1. Clone example repository

```sh
git clone https://github.com/graphcool-examples/react-native-graphql.git
cd react-native-graphql/subscriptions-with-apollo
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

#### 3.1. Simple API

Copy the `Simple API` endpoint to `./src/index.js` as the `uri` argument in the `createNetworkInterface` call:

```js
const networkInterface = createNetworkInterface({ uri: '__SIMPLE_API_ENDPOINT__' })
```

#### 3.1. Susbcriptions API

Copy the `Susbcriptions API` endpoint to `./src/index.js` as the argument for the constructor of the `SubscriptionClient`:

```js
const wsClient = new SubscriptionClient('__SUBSCRIPTIONS_API_ENDPOINT__')
```

You can obtain the `Susbcriptions API` endpoint by calling `graphcool endpoints` in the same directory where you called `graphcool init --schema https://graphqlbin.com/instagram.graphql` before or by clicking the **Endpoints** button in the bottom-left of the [Graphcool Console](https://console.graph.cool).


### 4. Install depdendencies & run locally

```sh
yarn install
yarn start # starts the packager
react-native run-ios # opens the simulator
# or react-native run-android
```

## Next steps

* [Advanced GraphQL features](https://www.graph.cool/docs/tutorials/advanced-features-eath7duf7d/)
* [Authentication & Permissions](https://www.graph.cool/docs/reference/authorization/overview-iegoo0heez/)
* [Implementing business logic with serverless functions](https://www.graph.cool/docs/reference/functions/overview-boo6uteemo/)


## Help & Community [![Slack Status](https://slack.graph.cool/badge.svg)](https://slack.graph.cool)

Say hello in our [Slack](http://slack.graph.cool/) or visit the [Graphcool Forum](https://www.graph.cool/forum) if you run into issues or have questions. We love talking to you!

![](http://i.imgur.com/5RHR6Ku.png)

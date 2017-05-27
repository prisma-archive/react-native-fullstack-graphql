# Expo & Relay Quickstart (Pokedex)

* [Expo](https://expo.io/): React Native toolchain to build native apps with Javascript and React
* [React Native](https://facebook.github.io/react-native/): Javascript framework for building native mobile apps with [React](https://facebook.github.io/react/)
* [Relay](https://facebook.github.io/relay/): Powerful GraphQL client developed by Facebook*
*  [Graphcool](https://www.graph.cool): Flexible backend platform combining GraphQL + AWS Lambda


## Quickstart

### 1. Clone example repository

```sh
git clone https://github.com/graphcool-examples/react-native-graphql.git
cd react-native-graphql/quickstart-with-expo-and-relay-pokedex
```

### 2. Create GraphQL API with [`graphcool`](https://www.npmjs.com/package/graphcool)

```sh
# Install Graphcool CLI
npm install -g graphcool

# Create a new project based on the Instagram schema
graphcool init --schema https://graphqlbin.com/simple-pokedex.graphql 
```

This creates a GraphQL API for the following schema:

```graphql
type Pokemon {
  name: String!
  url: String!
}
```

### 3. Connect the app with your GraphQL API

Copy the `Relay API` endpoint to `App.js` as the argument for the constructor of `Relay.DefaultNetworkLayer`, replacing `__RELAY_API_ENDPOINT__ `:

```js
// replace `__RELAY_API_ENDPOINT__ ` with the endpoint from the previous step
Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('__RELAY_API_ENDPOINT__')
);
```

Further, open `.graphqlrc` and copy the `Relay API` endpoint into it replacing `__RELAY_API_ENDPOINT__` in the following line:

```js
"url": "__RELAY_API_ENDPOINT_",
```

The line will look similar to this afterwards:

```js
"url": "https://api.graph.cool/relay/v1/<PROJECT_ID>`",
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

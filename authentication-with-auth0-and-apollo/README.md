# Auth0 Example (with React Native & Apollo)

* [React Native](https://facebook.github.io/react-native/): Javascript framework for building native mobile apps with [React](https://facebook.github.io/react/)
* [Apollo Client](https://github.com/apollographql/apollo-client): Fully-featured, production ready caching GraphQL client
* [Auth0](https://auth0.com/): Single Sign-On & Token Based Authentication
* [Graphcool](https://www.graph.cool): Flexible backend platform combining GraphQL + AWS Lambda

## Getting Started

### 1. Clone example repository

```sh
git clone https://github.com/graphcool-examples/react-native-graphql.git
cd react-native-graphql/authentication-with-auth0-and-apollo/Auth0Example
```

### 2. Create GraphQL API with [`graphcool`](https://www.npmjs.com/package/graphcool)

```sh
# Install Graphcool CLI
npm install -g graphcool

# Create a new project
graphcool init --schema https://graphqlbin.com/auth.graphql
```

This creates a GraphQL API for the following schema:

```graphql
type User {
  id: ID!
  name: String
}
```

### 3. Connect the app with your GraphQL API

Copy the `Simple API` endpoint to `./src/app.js` as the `uri` argument in the `createNetworkInterface` call:

```js
const networkInterface = createNetworkInterface({
  uri: '__SIMPLE_API_ENDPOINT__'
})
```

### 4. Configure Auth0 credentials

Copy the Auth0 `Client ID` and `Domain` to `src/components/login.js`:

```js
const AUTH0_CLIENT_ID = ''
const AUTH0_DOMAIN = ''
```

### 5. Install dependencies & run

```sh
yarn install
yarn start # this will run the react-native packager 
# use react-native run-ios or react-native run-android to run with device
```

## Next steps

* [Advanced GraphQL features](https://www.graph.cool/docs/tutorials/advanced-features-eath7duf7d/)
* [Authentication & Permissions](https://www.graph.cool/docs/reference/authorization/overview-iegoo0heez/)
* [Implementing business logic with serverless functions](https://www.graph.cool/docs/reference/functions/overview-boo6uteemo/)


## Help & Community [![Slack Status](https://slack.graph.cool/badge.svg)](https://slack.graph.cool)

Join our [Slack community](http://slack.graph.cool/) if you run into issues or have questions. We love talking to you!

![](http://i.imgur.com/5RHR6Ku.png)

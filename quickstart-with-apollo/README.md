# React Native & Apollo Quickstart

* [React Native](https://facebook.github.io/react-native/): Javascript framework for building native mobile apps with [React](https://facebook.github.io/react/)
* [Apollo Client](https://github.com/apollographql/apollo-client): Fully-featured, production ready caching GraphQL client
* [Graphcool](https://www.graph.cool): Flexible backend platform combining GraphQL + AWS Lambda

![](https://camo.githubusercontent.com/16899577cd7900f79f765d0689ff7664cf704ea5/687474703a2f2f696d6775722e636f6d2f547036356d45632e676966)

## Quickstart

### 1. Clone example repository

```sh
git clone https://github.com/graphcool-examples/react-native-graphql.git
cd react-native-graphql/quickstart-with-apollo
```

### 2. Create Graphcool service with the [Graphcool CLI](https://docs-next.graph.cool/reference/graphcool-cli/overview-zboghez5go)

```sh
# Install Graphcool Framework CLI
npm install -g graphcool

# Create a new service inside a directory called `server`
graphcool init server
```

This created the following file structure in the current directory:

```
.
└── server
    ├── graphcool.yml
    ├── types.graphql
    └── src
        ├── hello.graphql
        └── hello.js
```

### 3. Define data model

Next, you need to define your data model inside the newly created `types.graphql`-file.

Replace the current contents in `types.graphql` with the following type definition (you can delete the predefined `User` type):

```graphql
type Post @model {
  # Required system field
  id: ID! @isUnique # read-only (managed by Graphcool)

  # Optional system fields (remove if not needed)
  createdAt: DateTime! # read-only (managed by Graphcool)
  updatedAt: DateTime! # read-only (managed by Graphcool)

  description: String!
  imageUrl: String!
}
```

### 4. Deploy the GraphQL server

You're now ready to put your Graphcool service into production! Navigate into the `server` directory and [deploy](https://docs-next.graph.cool/reference/graphcool-cli/commands-aiteerae6l#graphcool-deploy) the service:

```sh
cd server
graphcool deploy
```

Save the HTTP endpoint for the `Simple API` from the output, you'll need it in the next step.

> **Note**: You can now test your GraphQL API inside a GraphQL playground. Simply type the `graphcool playground` command and start sending queries and mutations.


### 5. Connect the app with your GraphQL API

Paste the `Simple API` endpoint to `./App.js` as the `uri` argument in the `createNetworkInterface` call:

```js
// replace `__SIMPLE_API_ENDPOINT__` with the endpoint from the previous step
const httpLink = new HttpLink({ uri: '__SIMPLE_API_ENDPOINT__' })
```

> **Note**: If you ever lose your endpoint, you can get access to it again with the `graphcool info` command.

### 6. Install dependencies & run locally

```sh
cd ..
yarn install
yarn start          # open using the Expo app on your phone
# yarn run ios      # open with iOS simulator
# yarn run android  # open with Android emulator
```

## Next steps

* [Documentation](https://docs-next.graph.cool)
* [Advanced GraphQL features](https://blog.graph.cool/advanced-graphql-features-of-the-graphcool-api-5b8db3b0a71)
* [Authentication & Permissions](https://www.graph.cool/docs/reference/auth/overview-ohs4aek0pe/)
* [Implementing business logic with serverless functions](https://www.graph.cool/docs/reference/functions/overview-aiw4aimie9/)


## Help & Community [![Slack Status](https://slack.graph.cool/badge.svg)](https://slack.graph.cool)

Join our [Slack community](http://slack.graph.cool/) if you run into issues or have questions. We love talking to you!

![](http://i.imgur.com/5RHR6Ku.png)

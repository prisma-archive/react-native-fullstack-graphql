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

### 2. Create GraphQL API with [`graphcool`](https://www.npmjs.com/package/graphcool)

#### 2.1. Create Graphcool project

```sh
# Install Graphcool CLI
npm install -g graphcool

# Create a new "blank" project inside a directory called "graphcool"
graphcool init graphcool --template blank
```

This creates a new project inside your Graphcool account as well as the local project structure inside the `graphcool` directory:

```
.
└── graphcool
    ├── code
    │   ├── hello.graphql
    │   └── hello.js
    ├── graphcool.yml
    └── types.graphql

```

Read the documentation to learn more about the file structure and [project configuration](https://www.graph.cool/docs/reference/basics/project-configuration-t%28yaml%29-opheidaix3).

#### 2.2. Configure data model

Open `./graphcool/types.graphql` and add the following type definition to it:

```graphql
type Post {
  id: ID! @isUnique
  createdAt: DateTime!
  updatedAt: DateTime!
  description: String!
  imageUrl: String!
}
```

Now apply the changes you just made locally to the remote project in your Graphcool account:

```sh
cd graphcool
graphcool deploy
```

The `Post` type is now added to your data model and the corresponding CRUD operations are generated.

### 3. Connect the app with your GraphQL API

Copy the `Simple API` endpoint to `./src/root.js` as the `uri` argument in the `createNetworkInterface` call:

```js
// replace `__SIMPLE_API_ENDPOINT__` with the endpoint from the previous step
const networkInterface = createNetworkInterface({ uri: '__SIMPLE_API_ENDPOINT__' })
```

### 4. Install depdendencies & run locally

```sh
yarn install
yarn start # starts the packager
react-native run-ios # opens the simulator
# or react-native run-android
```

## Next steps

* [Advanced GraphQL features](https://blog.graph.cool/advanced-graphql-features-of-the-graphcool-api-5b8db3b0a71)
* [Authentication & Permissions](https://www.graph.cool/docs/reference/auth/overview-ohs4aek0pe/)
* [Implementing business logic with serverless functions](https://www.graph.cool/docs/reference/functions/overview-aiw4aimie9/)
* [Dive deeper into GraphQL on How to GraphQL](https://www.howtographql.com)



## Help & Community [![Slack Status](https://slack.graph.cool/badge.svg)](https://slack.graph.cool)

Join our [Slack community](http://slack.graph.cool/) if you run into issues or have questions. We love talking to you!

![](http://i.imgur.com/5RHR6Ku.png)

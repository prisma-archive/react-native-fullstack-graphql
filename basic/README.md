
# react-native-fullstack-graphql-basic

🚀 Basic starter code for a mobile app based on React Native, GraphQL & Apollo Client.

## Technologies

* **Frontend**
  * [React Native](https://facebook.github.io/react-native/): JavaScript framework for building native mobile apps with [React](https://facebook.github.io/react/)
  * [Expo](https://expo.io): Free and open source toolchain build around React Native to help you build native iOS and Android projects using JavaScript and React.
  * [Apollo Client](https://github.com/apollographql/apollo-client): Fully-featured, production ready caching GraphQL client
* **Backend**
  * [Prisma](https://www.prismagraphql.com): Turns your database into a GraphQL API
  * [`graphql-yoga`](https://github.com/graphcool/graphql-yoga/): Fully-featured GraphQL server with focus on easy setup, performance & great developer experience
  * [`prisma-binding`](https://github.com/graphcool/prisma-binding): [GraphQL binding](https://blog.graph.cool/reusing-composing-graphql-apis-with-graphql-bindings-80a4aa37cff5) for Prisma services

## Requirements

You need to have the following things installed:

* [Expo](https://expo.io/)
* Node 8+
* GraphQL CLI: `npm i -g graphql-cli`

## Getting started

```sh
# 1. Bootstrap GraphQL server in directory `my-app`, based on `react-native-basic` boilerplate
graphql create my-app --boilerplate react-native-basic

# 2. When prompted, choose the Prisma cluster you want to deploy to
# e.g. prisma-eu1 or prisma-us1 to deploy to a public cluster (recommended)
# or locally (requires Docker)

# 3. Navigate into the `server` directory of the new project
cd my-app/server

# 4. Start the server
yarn start # the server is now running on http://localhost:4000

# 5. Open a new tab in the terminal and navigate back into my-app
# then run the app
cd ..
yarn start

# 6. Open the app in a simulator or device of your choice
# open using the Expo app on your phone (does not work when server is deployed locally)
```

If you'd rather not use `graphql-cli`, follow these instructions:

```sh
# 1. 
```

## Docs

### Commands

#### While in the `server` folder

* `yarn start` starts GraphQL server on `http://localhost:4000` (only allows access to the _application_)
* `yarn dev` starts GraphQL server and opens the GraphQL Playground for the `projects` defined in [`.graphqlconfig.yml`](./.graphqlconfig.yml)
* `yarn playground` opens the GraphQL Playground for the `projects` defined in [`.graphqlconfig.yml`](./.graphqlconfig.yml)
* `yarn prisma <subcommand>` access to local version of Prisma CLI (e.g. `yarn prisma deploy`)

#### While no in the `server` folder

* `yarn start` 
* `yarn run ios` opens the iOS Simulator
* `yarn run android` opens the Android emulator

### Project structure

#### `/server`

- [`.graphqlconfig.yml`](./server/.graphqlconfig.yml) GraphQL configuration file containing the endpoints and schema configuration. Used by the [`graphql-cli`](https://github.com/graphcool/graphql-cli) and the [GraphQL Playground](https://github.com/graphcool/graphql-playground). See [`graphql-config`](https://github.com/graphcool/graphql-config) for more information.
- [`graphcool.yml`](./server/graphcool.yml): The root configuration file for your database service ([documentation](https://www.graph.cool/docs/1.0/reference/graphcool.yml/overview-and-example-foatho8aip)).

#### `/server/database`

- [`database/datamodel.graphql`](./server/database/datamodel.graphql) contains the data model that you define for the project (written in [SDL](https://blog.graph.cool/graphql-sdl-schema-definition-language-6755bcb9ce51)).
- [`database/schema.generated.graphql`](./server/database/schema.generated.graphql) defines the **database schema**. It contains the definition of the CRUD API for the types in your data model and is generated based on your `datamodel.graphql`. **You should never edit this file manually**, but introduce changes only by altering `datamodel.graphql` and run `graphcool deploy`.

#### `/server/src`

- [`src/schema.graphql`](src/schema.graphql) defines your **application schema**. It contains the GraphQL API that you want to expose to your client applications.
- [`src/index.js`](src/index.js) is the entry point of your server, pulling everything together and starting the `GraphQLServer` from [`graphql-yoga`](https://github.com/graphcool/graphql-yoga).

### Common questions

#### I'm getting a 'Schema could not be fetched.' error after deploying, what gives?

Access to the Graphcool API is secured by a secret. This also applies to the introspection query. Using the latest version of GraphQL Playground, the `Authorization` header should automatically be setup with a proper JWT signing the secret. If that's not the case, you can follow these steps to access your API:

1. Visit http://jwtbuilder.jamiekurtz.com/
1. Replace the `Key` at the bottom of the page with your `secret` from the [`graphcool.yml`](./server/graphcool.yml#L5)
1. Click `Create signed JWT` and copy the obtained token
1. Now, to access the schema, use the `Authorization: Bearer <token>` header, or in the GraphQL Playground set it as JSON:
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
1. Reload the schema in the Playground (the _refresh_-button is located right next to the URL of the server)

> Note: Currently, no content of the signed JWT is verified by the database! This will be implemented [according to this proposal](https://github.com/graphcool/framework/issues/1365) at a later stage.

## Contributing

Your feedback is **very helpful**, please share your opinion and thoughts! If you have any questions, join the [`#graphql-boilerplate`](https://graphcool.slack.com/messages/graphql-boilerplate) channel on our [Slack](https://graphcool.slack.com/).

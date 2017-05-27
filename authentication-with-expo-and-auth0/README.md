

# Auth0 Example (with Expo & Apollo)

* [Expo](https://expo.io/): React Native toolchain to build native apps with Javascript and React
* [Auth0](https://auth0.com/): Powerful authentication provider
* [Apollo Client](https://github.com/apollographql/apollo-client): Fully-featured, production ready caching GraphQL client
* [Graphcool](https://www.graph.cool): Flexible backend platform combining GraphQL + AWS Lambda


## Getting Started

### 1. Clone example repository

```sh
git clone https://github.com/graphcool-examples/react-native-graphql.git
cd react-native-graphql/authentication-with-expo-and-auth0
```

### 2.s Create GraphQL API with [`graphcool`](https://www.npmjs.com/package/graphcool)

```sh
# Install Graphcool CLI
npm install -g graphcool

# Create a new project based on the Instagram schema
graphcool init --schema http://graphqlbin.com/insta-expo-auth.graphql
```

This creates a GraphQL API for the following schema:

```graphql
type User {
  posts: [Post!]!  @relation(name: "PostsByUser")
  name: String!
  comments: [Comment!]! @relation(name: "CommentsByUser")
}

type Post {
  description: String!
  imageUrl: String!
  createdBy: User!  @relation(name: "PostsByUser")
  comments: [Comment!]! @relation(name: "CommentsOnPost")
}

type Comment {
  content: String!
  post: Post! @relation(name: "CommentsOnPost")
  author: User! @relation(name: "CommentsByUser")
}
```

### 3. Auth0 Configuration

In this step we will connect the Graphcool project to your Auth0 account.

#### 3.1 Create new Auth0 client

Go to the [Auth0 website](https://auth0.com/) and log into your Auth0 account. Create a new **Client**, choose **Single Page Application** and call it `instagram-example-graphcool`. 

### 3.2 Configure Auth0 with Graphcool

Back in the [console](https://console.graph.cool), open the **Integrations** tab in the side-menu and click on the Auth0 integration.

Now copy over your **domain**, **client id** and **client secret** from the previous step into the corresponding fields:

![](http://imgur.com/xW0rCSM.png)

### 3.3 Configure Auth0 with the app

1. Download the [Expo Development Environment](https://docs.expo.io/versions/v14.0.0/introduction/installation.html) (**XDE**) open it and sign in
2. Open this project by clicking **Project** on the top-left and selecting the directory `with-expo-and-auth0`
3. From the expo URL that you see in the address bar on top, copy everything **except for the colon and port** as shown in this screenshot: ![](http://i.imgur.com/8f0qPdg.png)
4. In `main.js`, set the `redirect_uri` variable by replacing the part `<Expo URL without Port>` with the value you just copied; note that you need to do this in the first part of the `if`-clause, the `else`-part is for the case where the app has been published, then Expo will set the variable for you  
5. Lastly, back on the config page of the `instagram-example-graphcool` client on the [Auth0 website](https://manage.auth0.com/#/clients) copy the _full value_ of `redirect_uri` from `main.js` into the field **Allowed Callback URLs** (it will look similar to `exp://da-x7f.johndoe.expo-auth0.exp.direct/+/redirect`)
6. Make sure to click **Save Changes** on the bottom of the page


### 4. Connect the app with your GraphQL API

Copy the `Simple API` endpoint to `./main.js` as the `uri` argument in the `createNetworkInterface` call:

```js
const networkInterface = createNetworkInterface({ uri: '__SIMPLE_API_ENDPOINT__' })
```

Set the variable `auth0_client_id` by completely replacing the current value of the variable with your `Client Id` from before.

Set the variable `authorize_url` by only replacing the part `<Domain>` with your `Domain` from before (it will then look similar to: `https://johndoe.eu.auth0.com/authorize`).

### 5. Install depdendencies & run locally

```sh
yarn install
```

You can now run the app by using the **Send Link** option in XDE. This will send a link to an email address of your choice - if you then open the link on a smartphone, the app will be started. 

Note that **Auth0 authentication with Expo currently only works when running the app on a _real device_ !!** 

If you'd like to know more about how the Auth0 flow works with Expo from a technical perspective, you can refer to [this example](https://github.com/AppAndFlow/exponent-auth0-example).


## Publishing the App

In case you want to make your app accessible to other Expo users, or even publish it on the App Store, you will need to add another url to the field **Allowed Callback URLs** in the config page of your Auth0 client on the [Auth0 website](https://manage.auth0.com/#/clients). 

This URL will have the following structure: `exp://exp.host/@<Your Expo Username>/<Your Expo App>/+/redirect` (so it will look similar to 
this one: `exp://exp.host/@johndoe/expo-auth0/+/redirect`)


## Next steps

* [Advanced GraphQL features](https://www.graph.cool/docs/tutorials/advanced-features-eath7duf7d/)
* [Authentication & Permissions](https://www.graph.cool/docs/reference/authorization/overview-iegoo0heez/)
* [Implementing business logic with serverless functions](https://www.graph.cool/docs/reference/functions/overview-boo6uteemo/)



## Help & Community [![Slack Status](https://slack.graph.cool/badge.svg)](https://slack.graph.cool)

Join our [Slack community](http://slack.graph.cool/) if you run into issues or have questions. We love talking to you!

![](http://i.imgur.com/5RHR6Ku.png)









const { GraphQLServer } = require('graphql-yoga');

const typeDefs = `
type Query {
  hello: String
}
`;

const resolvers = {
  Query: {
    hello() {
      return 'Hello world!';
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log('Server is running on http://localhost:4000'));

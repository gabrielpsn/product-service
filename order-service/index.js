// order-service/index.js
const { ApolloServer } = require("@apollo/server");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const { gql } = require("graphql-tag");
const { startStandaloneServer } = require("@apollo/server/standalone");

const typeDefs = gql`
  type Order @key(fields: "id") {
    id: ID!
    productId: ID!
    quantity: Int!
    totalPrice: Float!
    product: Product @requires(fields: "productId")
  }

  extend type Product @key(fields: "id") {
    id: ID! @external
  }

  extend type Query {
    order(id: ID!): Order
    orders: [Order]
  }
`;

const resolvers = {
  Query: {
    order: (_, { id }) => ({
      id,
      productId: "1",
      quantity: 2,
      totalPrice: 200.0,
    }),
    orders: () => [{ id: "1", productId: "1", quantity: 2, totalPrice: 200.0 }],
  },
  Order: {
    product: (order) => ({ __typename: "Product", id: order.productId }),
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4002 },
  });
  console.log(`Order service running at ${url}`);
}

startServer();

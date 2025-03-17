// product-service/index.js
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const { gql } = require("graphql-tag");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // 👈 Adicione CORS

const products = [
  {
    id: "1",
    name: "Notebook",
    description: "Notebook Dell",
    price: 4500.0,
    stock: 10,
  },
  {
    id: "2",
    name: "Mouse",
    description: "Mouse sem fio",
    price: 120.5,
    stock: 50,
  },
];

const typeDefs = gql`
  type Product @key(fields: "id") {
    id: ID!
    name: String!
    description: String!
    price: Float!
    stock: Int!
  }

  type Query {
    product(id: ID!): Product
    products: [Product]
  }
`;

const resolvers = {
  Query: {
    product: (_, { id }) => products.find((p) => p.id === id),
    products: () => products,
  },
  Product: {
    __resolveReference: (product) => products.find((p) => p.id === product.id),
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

startStandaloneServer(server, {
  listen: { port: 4001 },
  context: async ({ req }) => ({ req }),
}).then(({ url }) => {
  console.log(`🚀 Product Service: ${url}`);
});

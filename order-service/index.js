// order-service/index.js
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const { gql } = require("graphql-tag");
const express = require("express");
const cors = require("cors");
const setupSwagger = require("./src/config/swagger");
const orderRoutes = require("./src/routes/order.routes");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use("/api", orderRoutes);

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

const apolloServer = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

async function startServer() {
  await apolloServer.start();

  app.use(
    "/graphql",
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ req }),
    })
  );

  if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
      console.log(`🔄 GraphQL: http://localhost:${PORT}/graphql`);
      console.log(`📡 REST API: http://localhost:${PORT}/api/orders`);
    });
  }
}

startServer();

module.exports = app;

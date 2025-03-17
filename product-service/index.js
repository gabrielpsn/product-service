// product-service/index.js
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const { gql } = require("graphql-tag");
const express = require("express");
const cors = require("cors");
const setupSwagger = require("./src/config/swagger");

// Configuração do Express
const app = express();
const PORT = 4001;

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Configuração do Swagger
setupSwagger(app);

// Rotas REST
const productRoutes = require("./src/routes/product.routes");
app.use("/api", productRoutes);

// Dados mockados
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

// Schema GraphQL
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

// Resolvers GraphQL
const resolvers = {
  Query: {
    product: (_, { id }) => products.find((p) => p.id === id),
    products: () => products,
  },
  Product: {
    __resolveReference: (product) => products.find((p) => p.id === product.id),
  },
};

// Configuração do Apollo Server
const apolloServer = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

// Inicialização do servidor
async function startServer() {
  await apolloServer.start();

  // Middleware do GraphQL
  app.use(
    "/graphql",
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ req }),
    })
  );

  // Inicia o servidor
  if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
      console.log(`🔄 GraphQL: http://localhost:${PORT}/graphql`);
      console.log(`📡 REST API: http://localhost:${PORT}/api/products`);
    });
  }
}

startServer();

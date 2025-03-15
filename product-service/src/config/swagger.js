const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Pedidos",
      version: "1.0.0",
      description: "Documentação da API de pedidos usando Swagger",
    },
    servers: [
      {
        url: "http://localhost:3001/api", // URL base da API
        description: "Servidor Local",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Caminho para os arquivos de rota
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
};

module.exports = setupSwagger;

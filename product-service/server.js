require("dotenv").config();
const express = require("express");
const cors = require("cors");
const setupSwagger = require("./src/config/swagger"); // Importa Swagger

const app = express();

// Configuração de middlewares
app.use(cors());
app.use(express.json()); // Permite receber JSON nas requisições

setupSwagger(app); // Inicializa Swagger
// Rotas
const productRoutes = require("./src/routes/product.routes");
app.use("/api", productRoutes);

// Porta do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Product Service rodando na porta ${PORT}`);
});

module.exports = app;

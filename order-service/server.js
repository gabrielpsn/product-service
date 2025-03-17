const express = require("express");
const app = express();
const orderRoutes = require("./src/routes/order.routes");
const setupSwagger = require("./src/config/swagger"); // Importa Swagger

app.use(express.json());

setupSwagger(app);

app.use("/api", orderRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Order Service rodando na porta ${PORT}`);
});

module.exports = app;

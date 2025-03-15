const sequelize = require("./database");
const Product = require("../models/Product");

(async () => {
  await sequelize.sync({ force: true }); // Apaga e recria a tabela
  console.log("📦 Banco de dados sincronizado!");
  process.exit();
})();

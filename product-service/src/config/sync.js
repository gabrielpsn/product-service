const sequelize = require("./database");
const Product = require("../models/Product");

(async () => {
  await sequelize.sync({ force: true }); // Apaga e recria a tabela
  console.log("📦 Database synchronized!");
  process.exit();
})();

const sequelize = require("./database");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");

(async () => {
  await sequelize.sync({ force: true }); // Apaga e recria a tabela
  console.log("📦 Database synchronized!");
  process.exit();
})();

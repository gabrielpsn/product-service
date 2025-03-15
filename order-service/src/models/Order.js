const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    totalPrice: { type: DataTypes.FLOAT, allowNull: false },
    shippingCost: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "pending" },
  },
  { timestamps: true }
);

module.exports = Order;

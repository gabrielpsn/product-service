const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      required: true,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      required: true,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Product;

const axios = require("axios");
require("dotenv").config();

const calculateFreight = async (zipcode) => {
  try {
    const response = await axios.post(
      process.env.BASE_URL_API_SHIPPING_SERVICE,
      {
        origin: process.env.ZIP_CODE_ORIGIN,
        destination: zipcode,
        weight: 1,
      }
    );

    return response.data.price;
  } catch (error) {
    throw new Error("Não foi possível calcular o frete");
  }
};

module.exports = { calculateFreight };

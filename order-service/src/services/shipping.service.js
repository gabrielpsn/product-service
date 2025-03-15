const axios = require("axios");

const calculateFreight = async (zipcode) => {
  try {
    console.log(`Consultando frete para CEP: ${zipcode}`);

    // Agora apontamos para nosso servidor local de mock
    const response = await axios.post("http://localhost:3005/calculate", {
      origin: "01000-000",
      destination: zipcode,
      weight: 1,
    });

    console.log(`Frete calculado: R$ ${response.data.price}`);

    return response.data.price;
  } catch (error) {
    console.error("Erro ao calcular frete:", error.message);
    throw new Error("Não foi possível calcular o frete");
  }
};

module.exports = { calculateFreight };

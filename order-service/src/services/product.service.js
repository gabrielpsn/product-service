const axios = require("axios");
require("dotenv").config();

class ProductService {
  // ... (métodos existentes)

  async decreaseProductStock(productId, quantity) {
    try {
      const response = await axios.post(
        `${process.env.BASE_URL_API_PRODUCT_SERVICE}/${productId}/stock`,
        { quantity }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao dar baixa no estoque: ${error.message}`);
    }
  }
}

module.exports = new ProductService();

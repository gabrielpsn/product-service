import axios from "axios";

// Cria a instância do Axios com a URL base do microserviço de produto
const api = axios.create({
  baseURL: "http://localhost:3001/products", // URL do microserviço de produto
  timeout: 5000, // Tempo limite de 5 segundos para a requisição
  headers: {
    "Content-Type": "application/json", // Tipo de conteúdo como JSON
  },
});

export default api;

const express = require("express");
const app = express();
app.use(express.json());

// Simula um serviço de frete baseado no CEP
app.post("/calculate", (req, res) => {
  const { destination } = req.body;

  if (!destination || !/^\d{5}-\d{3}$/.test(destination)) {
    console.log("CEP inválido.");
    return res.status(400).json({ error: "CEP inválido." });
  }

  // Simula cálculo de frete baseado na distância (mock)
  const basePrice = 10;
  const variableCost = Math.random() * 10;
  const freightPrice = (basePrice + variableCost).toFixed(2);

  return res.json({ price: parseFloat(freightPrice) });
});

app.listen(4003, () =>
  console.log("Mock de API de Frete rodando na porta 3005")
);

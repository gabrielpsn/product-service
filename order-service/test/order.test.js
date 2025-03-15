const request = require("supertest");
const app = require("../index"); // Importa a API para os testes

describe("Testes de Pedidos", () => {
  it("Deve criar um pedido com sucesso", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        items: [{ productId: 1, quantity: 2, price: 10.5 }],
        shippingZipcode: "12345-678",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("Deve retornar todos os pedidos", async () => {
    const response = await request(app).get("/api/orders");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("Deve retornar erro ao criar pedido sem dados", async () => {
    const response = await request(app).post("/api/orders").send({});
    expect(response.status).toBe(400);
  });

  it("Deve buscar um pedido pelo ID", async () => {
    const newOrder = await request(app)
      .post("/api/orders")
      .send({
        items: [{ productId: 2, quantity: 1, price: 15 }],
        shippingZipcode: "54321-876",
      });

    const response = await request(app).get(`/api/orders/${newOrder.body.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", newOrder.body.id);
  });

  it("Deve retornar erro ao buscar pedido inexistente", async () => {
    const response = await request(app).get("/api/orders/999");
    expect(response.status).toBe(404);
  });
});

describe("Testes de Frete e Pedido", () => {
  it("Deve rejeitar um pedido sem itens", async () => {
    const response = await request(app).post("/api/orders").send({
      items: [],
      shippingZipcode: "12345-678",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "O pedido deve conter pelo menos um item."
    );
  });

  it("Deve rejeitar um pedido com CEP inválido", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        items: [{ productId: 1, quantity: 2, price: 50 }],
        shippingZipcode: "12345678",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("CEP inválido. Use o formato XXXXX-XXX.");
  });

  it("Deve calcular o frete e criar um pedido válido", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        items: [{ productId: 1, quantity: 2, price: 50 }],
        shippingZipcode: "12345-678",
      });

    expect(response.status).toBe(201);
    expect(response.body.freightCost).toBe(20.0);
    expect(response.body.totalPrice).toBe(120.0); // 2x50 + 20 de frete
    expect(calculateFreight).toHaveBeenCalledWith("12345-678");
  });
});

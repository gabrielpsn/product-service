const request = require("supertest");
const app = require(".."); // Importa a aplicação Express
const Order = require("../src/models/Order");
const OrderItem = require("../src/models/OrderItem");

// Simula os métodos do Sequelize para evitar chamadas reais ao banco de dados
jest.mock("../src/models/Order", () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock("../src/models/OrderItem", () => ({
  bulkCreate: jest.fn(),
}));

describe("Testes do CRUD de Pedidos", () => {
  it("Deve criar um novo pedido", async () => {
    // Mock dos métodos do Sequelize
    Order.create.mockResolvedValue({ id: 1 });
    OrderItem.bulkCreate.mockResolvedValue([]);

    const response = await request(app)
      .post("/api/orders")
      .send({
        items: [
          { productId: 1, quantity: 2, price: 50 },
          { productId: 2, quantity: 1, price: 30 },
        ],
        shippingZipcode: "12345-678",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Pedido criado com sucesso!"
    );
    expect(response.body).toHaveProperty("orderId", 1);
  });

  it("Deve retornar erro ao criar pedido sem itens", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({ items: [], shippingZipcode: "12345-678" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "O pedido deve conter pelo menos um item."
    );
  });

  it("Deve listar pedidos", async () => {
    const mockOrders = [
      { id: 1, totalPrice: 100, shippingCost: 10 },
      { id: 2, totalPrice: 200, shippingCost: 15 },
    ];
    Order.findAll.mockResolvedValue(mockOrders);

    const response = await request(app).get("/api/orders");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("totalPrice", 100);
  });

  it("Deve retornar um pedido específico", async () => {
    const mockOrder = { id: 1, totalPrice: 100, shippingCost: 10 };
    Order.findByPk.mockResolvedValue(mockOrder);

    const response = await request(app).get("/api/orders/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
  });

  it("Deve retornar erro ao buscar pedido inexistente", async () => {
    Order.findByPk.mockResolvedValue(null);

    const response = await request(app).get("/api/orders/99");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Pedido não encontrado.");
  });

  it("Deve atualizar o status do pedido", async () => {
    const mockOrder = { id: 1, status: "pending", save: jest.fn() };
    Order.findByPk.mockResolvedValue(mockOrder);

    const response = await request(app)
      .put("/api/orders/1/status")
      .send({ status: "shipped" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Status atualizado com sucesso!"
    );
    expect(mockOrder.save).toHaveBeenCalled();
  });

  it("Deve retornar erro ao tentar atualizar status de pedido inexistente", async () => {
    Order.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .put("/api/orders/99/status")
      .send({ status: "shipped" });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error", "Pedido não encontrado.");
  });
});

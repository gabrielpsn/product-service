const request = require("supertest");
const app = require("../server");
const Order = require("../src/models/Order");
const OrderItem = require("../src/models/OrderItem");

// Mock do Product Service
jest.mock("../src/services/product.service", () => ({
  checkProductAvailability: jest.fn(),
  calculateProductPrice: jest.fn(),
  decreaseProductStock: jest.fn().mockResolvedValue({ success: true }),
}));

const productService = require("../src/services/product.service");

// Mock dos models do Sequelize
jest.mock("../src/models/Order", () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock("../src/models/OrderItem", () => ({
  bulkCreate: jest.fn(),
}));

describe("Testes do CRUD de Pedidos", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa todos os mocks antes de cada teste
  });

  // --- Teste: Criar novo pedido ---
  it("Deve criar um novo pedido", async () => {
    productService.checkProductAvailability.mockResolvedValue(true);
    productService.calculateProductPrice.mockResolvedValue(50);
    productService.decreaseProductStock.mockResolvedValue({ success: true });
    Order.create.mockResolvedValue({ id: 1 });
    OrderItem.bulkCreate.mockResolvedValue([]);

    const response = await request(app)
      .post("/api/orders")
      .send({
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
        shippingZipcode: "53431-125",
      });

    // Verificações principais
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Pedidos criado com sucesso!");
  });

  // --- Teste: Pedido sem itens ---
  it("Deve retornar erro ao criar pedido sem itens", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({ items: [], shippingZipcode: "12345-678" });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain(
      "O pedido deve conter pelo menos um item."
    );
  });

  // --- Teste: Listar pedidos ---
  it("Deve listar pedidos", async () => {
    const mockOrders = [
      { id: 1, totalPrice: 100, shippingCost: 10 },
      { id: 2, totalPrice: 200, shippingCost: 15 },
    ];
    Order.findAll.mockResolvedValue(mockOrders);

    const response = await request(app).get("/api/orders");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrders);
  });

  // --- Teste: Buscar pedido específico ---
  it("Deve retornar um pedido específico", async () => {
    const mockOrder = { id: 1, totalPrice: 100, shippingCost: 10 };
    Order.findByPk.mockResolvedValue(mockOrder);

    const response = await request(app).get("/api/orders/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrder);
  });

  // --- Teste: Pedido inexistente ---
  it("Deve retornar erro ao buscar pedido inexistente", async () => {
    Order.findByPk.mockResolvedValue(null);

    const response = await request(app).get("/api/orders/99");

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("não encontrado");
  });

  // --- Teste: Atualizar status do pedido ---
  it("Deve atualizar o status do pedido", async () => {
    const mockOrder = {
      id: 1,
      status: "pending",
      save: jest.fn().mockResolvedValue(true),
    };
    Order.findByPk.mockResolvedValue(mockOrder);

    const response = await request(app)
      .put("/api/orders/1/status")
      .send({ status: "shipped" });

    expect(response.status).toBe(200);
    expect(mockOrder.save).toHaveBeenCalled();
  });

  // --- Teste: Atualizar status de pedido inexistente ---
  it("Deve retornar erro ao atualizar status de pedido inexistente", async () => {
    Order.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .put("/api/orders/99/status")
      .send({ status: "shipped" });

    expect(response.status).toBe(404);
  });

  // --- Teste: Erro no cálculo do preço ---
  it("Deve retornar erro no cálculo do preço", async () => {
    productService.checkProductAvailability.mockResolvedValue(true);
    productService.calculateProductPrice.mockRejectedValue(
      new Error("Erro no cálculo")
    );

    const response = await request(app)
      .post("/api/orders")
      .send({
        items: [{ productId: 1, quantity: 2 }],
        shippingZipcode: "21321313131",
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toContain("Erro ao criar o pedido.");
  });
});

const request = require("supertest");
const app = require("../index");
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

describe("Order CRUD Testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Must create a new order", async () => {
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

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Request created successfully");
  });

  it("Should return error when creating order without items", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({ items: [], shippingZipcode: "12345-678" });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain(
      "The order must contain at least one item."
    );
  });

  it("Must list orders", async () => {
    const mockOrders = [
      { id: 1, totalPrice: 100, shippingCost: 10 },
      { id: 2, totalPrice: 200, shippingCost: 15 },
    ];
    Order.findAll.mockResolvedValue(mockOrders);

    const response = await request(app).get("/api/orders");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrders);
  });

  it("Must return a specific order", async () => {
    const mockOrder = { id: 1, totalPrice: 100, shippingCost: 10 };
    Order.findByPk.mockResolvedValue(mockOrder);

    const response = await request(app).get("/api/orders/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockOrder);
  });

  it("Should return error when searching for non-existent order", async () => {
    Order.findByPk.mockResolvedValue(null);

    const response = await request(app).get("/api/orders/99");

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("Order not found");
  });

  it("Must update the order status", async () => {
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

  it("Should return error when updating non-existent order status", async () => {
    Order.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .put("/api/orders/99/status")
      .send({ status: "shipped" });

    expect(response.status).toBe(404);
  });

  it("Should return error in price calculation", async () => {
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
    expect(response.body.error).toContain("Error creating order");
  });

  it("deve atualizar o status do pedido e retornar 200", async () => {
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
    expect(response.body).toEqual({
      message: "Status updated successfully!",
      order: expect.objectContaining({
        id: 1,
        status: "shipped",
      }),
    });

    expect(mockOrder.status).toBe("shipped");

    expect(mockOrder.save).toHaveBeenCalled();
  });
});

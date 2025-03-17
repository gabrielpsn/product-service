// Testes Unitários
const request = require("supertest");
const app = require("../../index");

jest.mock("../models/Order", () => ({ create: jest.fn() }));
jest.mock("../models/OrderItem", () => ({ bulkCreate: jest.fn() }));
jest.mock("../services/shipping.service", () => ({
  calculateFreight: jest.fn(),
}));
jest.mock("../services/product.service", () => ({
  productService: { post: jest.fn() },
}));
jest.mock("../config/database", () => ({
  transaction: jest
    .fn()
    .mockReturnValue({ commit: jest.fn(), rollback: jest.fn() }),
}));

const { createOrder } = require("../controllers/order.controller");

describe("Order Controller", () => {
  it("deve criar um pedido com sucesso", async () => {
    const mockOrder = {
      id: 1,
      totalPrice: 150,
      shippingCost: 20,
      status: "PENDING",
    };
    Order.create.mockResolvedValue(mockOrder);
    calculateFreight.mockResolvedValue(20);
    productService.post.mockResolvedValue({
      data: {
        validItems: [{ productId: 1, quantity: 2, price: 65 }],
        totalPrice: 130,
      },
    });
    OrderItem.bulkCreate.mockResolvedValue();

    const response = await request(app)
      .post("/orders")
      .send({
        items: [{ productId: 1, quantity: 2 }],
        shippingZipcode: "12345-678",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Pedido criado com sucesso");
  });

  it("deve retornar erro ao criar pedido sem itens", async () => {
    const response = await request(app)
      .post("/orders")
      .send({ shippingZipcode: "12345-678" });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Itens do pedido são obrigatórios");
  });

  it("deve retornar erro quando o serviço de produtos falhar", async () => {
    productService.post.mockRejectedValue(
      new Error("Serviço de produtos indisponível")
    );

    const response = await request(app)
      .post("/orders")
      .send({
        items: [{ productId: 1, quantity: 2 }],
        shippingZipcode: "12345-678",
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Serviço de produtos indisponível");
  });

  it("deve retornar erro quando o frete falhar", async () => {
    productService.post.mockResolvedValue({
      data: {
        validItems: [{ productId: 1, quantity: 2, price: 65 }],
        totalPrice: 130,
      },
    });
    calculateFreight.mockRejectedValue(new Error("Erro no cálculo de frete"));

    const response = await request(app)
      .post("/orders")
      .send({
        items: [{ productId: 1, quantity: 2 }],
        shippingZipcode: "12345-678",
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Erro no cálculo de frete");
  });
});

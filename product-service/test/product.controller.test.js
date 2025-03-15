const request = require("supertest");
const app = require("../server");
const Product = require("../src/models/Product");

// Simulando um banco de dados com Sequelize Mock
jest.mock("../src/models/Product", () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

describe("Product Controller", () => {
  it("Deve criar um novo produto", async () => {
    const newProduct = {
      name: "Produto Teste",
      description: "Descrição do produto",
      price: 99.99,
      stock: 10,
    };

    Product.create.mockResolvedValue(newProduct);

    const response = await request(app).post("/products").send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Produto Teste");
  });

  it("Deve retornar a lista de produtos", async () => {
    const mockProducts = [
      { id: 1, name: "Produto Teste", price: 99.99, stock: 10 },
    ];
    Product.findAll.mockResolvedValue(mockProducts);

    const response = await request(app).get("/products");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("Deve buscar um produto por ID", async () => {
    const mockProduct = {
      id: 1,
      name: "Produto Teste",
      description: "Descrição do produto",
      price: 99.99,
      stock: 10,
    };
    Product.findByPk.mockResolvedValue(mockProduct);

    const response = await request(app).get("/products/1");
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Produto Teste");
  });

  it("Deve atualizar um produto", async () => {
    const updatedProduct = {
      id: 1,
      name: "Produto Atualizado",
      description: "Descrição do produto Atualizado",
      price: 50,
      stock: 5,
    };
    Product.findByPk.mockResolvedValue(updatedProduct);
    Product.update.mockResolvedValue(updatedProduct);

    const response = await request(app)
      .put("/products/1")
      .send({ name: "Produto Atualizado" });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Produto Atualizado");
  });

  it("Deve excluir um produto", async () => {
    const deletedProduct = {
      id: 1,
      name: "Produto deletado",
      description: "Descrição do produto deletado",
      price: 50,
      stock: 5,
    };
    Product.findByPk.mockResolvedValue(deletedProduct);
    Product.destroy.mockResolvedValue(deletedProduct);

    const response = await request(app).delete("/products/1");
    expect(response.status).toBe(204);
  });
});

const request = require("supertest");
const app = require("../index");
const Product = require("../src/models/Product");

jest.mock("../src/models/Product", () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

describe("Product Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Must create a new product with success", async () => {
    const newProduct = {
      name: "Product one",
      description: "description of product one",
      price: 99.99,
      stock: 10,
    };

    Product.create.mockResolvedValue({ id: 1, ...newProduct });

    const response = await request(app).post("/api/products").send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe("Product one");
  });

  it("Should return error 400 when trying to create a product without required fields", async () => {
    const response = await request(app).post("/api/products").send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("All fields are required");
  });

  it("Should return error 500 if product creation fails", async () => {
    Product.create.mockRejectedValue(new Error("Error creating product"));

    const response = await request(app).post("/api/products").send({
      name: "Produto Teste",
      description: "Descrição",
      price: 99.99,
      stock: 10,
    });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error creating product");
  });

  it("Should return the product list", async () => {
    const mockProducts = [
      { id: 1, name: "Product Test", price: 99.99, stock: 10 },
    ];
    Product.findAll.mockResolvedValue(mockProducts);

    const response = await request(app).get("/api/products");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe("Product Test");
  });

  it("Must search for a product by ID", async () => {
    const mockProduct = {
      id: 1,
      name: "Product Test",
      description: "Descrição",
      price: 99.99,
      stock: 10,
    };
    Product.findByPk.mockResolvedValue(mockProduct);

    const response = await request(app).get("/api/products/1");
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product Test");
  });

  it("Should return error 404 when trying to update a non-existent product", async () => {
    Product.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .put("/api/products/9999")
      .send({ name: "Produto Atualizado" });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Product not found");
  });

  it("Must update a product", async () => {
    const updatedProduct = {
      id: 1,
      name: "Product Updated",
      price: 50,
      stock: 5,
    };

    Product.findByPk.mockResolvedValue(updatedProduct);
    Product.update.mockResolvedValue([1]);

    const response = await request(app)
      .put("/api/products/1")
      .send({ name: "Product Updated" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product updated successfully");
  });

  it("Should return 404 when trying to delete a non-existent product", async () => {
    Product.findByPk.mockResolvedValue(null);

    const response = await request(app).delete("/api/products/999");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Product not found");
  });

  it("Must delete a product", async () => {
    Product.findByPk.mockResolvedValue({ id: 1 });
    Product.destroy.mockResolvedValue(1);

    const response = await request(app).delete("/api/products/1");
    expect(response.status).toBe(204);
  });

  it("Must reduce the stock of a product", async () => {
    const product = { id: 1, name: "Product Test", stock: 10 };
    Product.findByPk.mockResolvedValue(product);
    Product.update.mockResolvedValue([1]);

    const response = await request(app)
      .put("/api/products/1/decrease-stock")
      .send({ quantity: 2 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Estoque atualizado com sucesso");
  });

  it("Should return 500 if there is an error fetching the products", async () => {
    // Simulando um erro no banco de dados
    Product.findAll.mockRejectedValue(new Error("Erro no banco de dados"));

    const response = await request(app).get("/api/products");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty(
      "error",
      "Error searching for products"
    );
  });

  it("Should return error 404 when searching for a non-existent product", async () => {
    Product.findByPk.mockResolvedValue(null);

    const response = await request(app).get("/api/products/999");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Product not found");
  });

  it("Should return error 500 if product fetch fails", async () => {
    Product.findByPk.mockRejectedValue(
      new Error("Error searching for product")
    );

    const response = await request(app).get("/api/products/1");
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error searching for product");
  });

  it("Should return error 500 when trying to update a product and failing", async () => {
    Product.findByPk.mockResolvedValue({ id: 1 });
    Product.update.mockRejectedValue(new Error("Error updating product"));

    const response = await request(app)
      .put("/api/products/1")
      .send({ name: "Produto Atualizado" });
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Error updating product");
  });

  it("Should return error 500 when trying to delete a product and failing", async () => {
    Product.findByPk.mockResolvedValue({ id: 1 });
    Product.destroy.mockRejectedValue(new Error("Erro interno"));

    const response = await request(app).delete("/api/products/1");
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Erro interno");
  });

  it("Error 400 should be returned when trying to reduce stock without the quantity being informed.", async () => {
    const response = await request(app)
      .put("/api/products/1/decrease-stock")
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Quantidade é obrigatória");
  });

  it("Should return error 404 when trying to reduce the stock of a non-existent product", async () => {
    Product.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .put("/api/products/999/decrease-stock")
      .send({ quantity: 5 });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Product not found");
  });

  it("Should return error if there is not enough stock", async () => {
    const product = { id: 1, name: "Product Test", stock: 1 };
    Product.findByPk.mockResolvedValue(product);

    const response = await request(app)
      .put("/api/products/1/decrease-stock")
      .send({ quantity: 5 });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Estoque insuficiente");
  });

  it("Deve retornar erro 500 ao tentar diminuir estoque e falhar", async () => {
    Product.findByPk.mockResolvedValue({ id: 1, stock: 10 });
    Product.update.mockRejectedValue(new Error("Erro ao atualizar o estoque"));

    const response = await request(app)
      .put("/api/products/1/decrease-stock")
      .send({ quantity: 5 });
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Erro ao atualizar o estoque");
  });
});

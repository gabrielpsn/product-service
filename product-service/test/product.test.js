const request = require("supertest");
const app = require("../server");
const sequelize = require("../src/config/database"); // Importa a conexão do banco de dados
const Product = require("../src/models/Product");

describe("E2E - Product Microservice", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  let productId;

  it("Must create a new product with success", async () => {
    const response = await request(app).post("/api/products").send({
      name: "Product Test",
      description: "Description Test",
      price: 100.0,
      stock: 10,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Product Test");

    productId = response.body.id;
  });

  it("Should return the product list", async () => {
    const response = await request(app).get("/api/products");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("Must search for a product by ID", async () => {
    const response = await request(app).get(`/api/products/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
    expect(response.body.name).toBe("Product Test");
  });

  it("Must update a product", async () => {
    const response = await request(app)
      .put(`/api/products/${productId}`)
      .send({ name: "Produto Atualizado", price: 120.0 });

    expect(response.status).toBe(200);
    expect(response.body.data.name).toBe("Produto Atualizado");
    expect(response.body.data.price).toBe(120.0);
  });

  it("Should fail when searching for a non-existent product", async () => {
    const response = await request(app).get("/api/products/99999");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Product not found");
  });

  it("Must delete a product", async () => {
    const response = await request(app).delete(`/api/products/${productId}`);

    expect(response.status).toBe(204);
  });

  it("Should fail when deleting a non-existent product", async () => {
    const response = await request(app).delete(`/api/products/${productId}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Product not found");
  });
});

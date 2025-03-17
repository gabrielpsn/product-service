const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for product management and inventory control
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product Name
 *               price:
 *                 type: number
 *                 description: Product Price
 *               stock:
 *                 type: integer
 *                 description: Stock Quantity
 *               description:
 *                 type: string
 *                 description: Product Description
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Error creating product
 */
router.post("/products", ProductController.createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Return all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Product List
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         productId:
 *           type: integer
 *           description: Product ID
 *         name:
 *           type: string
 *           description: Product Name
 *         price:
 *           type: number
 *           description: Product Price
 *         stock:
 *           type: integer
 *           description: Product Stock
 *         description:
 *           type: string
 *           description: Product Description
 */
router.get("/products", ProductController.getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Returns a specific product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product you want to query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error searching for product
 */
router.get("/products/:id", ProductController.getProductById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to be updated
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error updating product
 */
router.put("/products/:id", ProductController.updateProduct);

/**
 * @swagger
 * /products/{productId}/decrease-stock:
 *   put:
 *     summary: Reduces inventory of a specific product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: Product ID for which the stock quantity will be reduced
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Quantity to be removed from stock
 *     responses:
 *       200:
 *         description: Product stock updated successfully
 *       400:
 *         description: Insufficient quantity in stock
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal error when trying to update inventory
 */
router.put(
  "/products/:productId/decrease-stock",
  ProductController.decreaseStock
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a specific product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID to be deleted
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete("/products/:id", ProductController.deleteProduct);

module.exports = router;

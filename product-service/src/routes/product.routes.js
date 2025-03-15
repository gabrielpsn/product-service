const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: API para gerenciamento de produtos e controle de estoque.
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do produto.
 *               price:
 *                 type: number
 *                 description: Preço do produto.
 *               stock:
 *                 type: integer
 *                 description: Quantidade de estoque disponível.
 *               description:
 *                 type: string
 *                 description: Descrição do produto.
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Erro ao criar produto
 */
router.post("/products", ProductController.createProduct);
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retorna todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   stock:
 *                     type: integer
 *                   description:
 *                     type: string
 */
router.get("/products", ProductController.getAllProducts);
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retorna um produto específico
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto que deseja consultar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *                 stock:
 *                   type: integer
 *                 description:
 *                   type: string
 *       404:
 *         description: Produto não encontrado
 */
router.get("/products/:id", ProductController.getProductById);
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser atualizado.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       400:
 *         description: Erro ao atualizar produto
 *       404:
 *         description: Produto não encontrado
 */
router.put("/products/:id", ProductController.updateProduct);
/**
 * @swagger
 * /products/{productId}/decrease-stock:
 *   put:
 *     summary: Reduz o estoque de um produto específico
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID do produto para o qual a quantidade de estoque será reduzida.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: Quantidade a ser retirada do estoque.
 *     responses:
 *       200:
 *         description: Estoque do produto atualizado com sucesso.
 *       400:
 *         description: Quantidade insuficiente em estoque.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno ao tentar atualizar o estoque.
 */
router.put(
  "/products/:productId/decrease-stock",
  ProductController.decreaseStock
);
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Exclui um produto específico
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto a ser excluído.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto excluído com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.delete("/products/:id", ProductController.deleteProduct);

module.exports = router;

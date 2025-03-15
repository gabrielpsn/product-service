const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *               shippingZipcode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Erro ao criar pedido
 */
router.post("/orders", orderController.createOrder);
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retorna todos os pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get("/orders", orderController.getOrders);
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Retorna um pedido específico
 *     tags: [Pedidos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do pedido
 *       404:
 *         description: Pedido não encontrado
 */
router.get("/orders/:id", orderController.getOrderById);
router.put("/orders/:id/status", orderController.updateOrderStatus);

module.exports = router;

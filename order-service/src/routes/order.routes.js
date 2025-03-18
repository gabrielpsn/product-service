const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
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
 *         description: Request created successfully
 *       400:
 *         description: The order must contain at least one item.
 *       500:
 *         description: Error creating order
 */
router.post("/orders", orderController.createOrder);
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Returns all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Order list
 *       500:
 *         description: Error fetching orders
 */
router.get("/orders", orderController.getOrders);
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Returns a specific order
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order Details
 *       404:
 *         description: Request not found
 *       500:
 *         description: Error fetching order.
 */
router.get("/orders/:id", orderController.getOrderById);
/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order status updated
 *       404:
 *         description: Request not found
 *       500:
 *         description: Error updating order status
 */
router.put("/orders/:id/status", orderController.updateOrderStatus);

module.exports = router;

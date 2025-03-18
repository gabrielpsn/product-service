const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const { calculateFreight } = require("../services/shipping.service");
const productService = require("../services/product.service");

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingZipcode } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "The order must contain at least one item." });
    }

    const shippingCost = await calculateFreight(shippingZipcode);

    const orderTotalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      totalPrice: orderTotalPrice + shippingCost,
      shippingCost,
    });

    const orderItems = items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItem.bulkCreate(orderItems);

    await Promise.all(
      items.map((item) =>
        productService.decreaseProductStock(item.productId, item.quantity)
      )
    );

    res
      .status(201)
      .json({ message: "Request created successfully", data: items });
  } catch (error) {
    res.status(500).json({ error: "Error creating order" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: "items",
        },
      ],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders." });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: "items",
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching order" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Request not found" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Status updated successfully!", order });
  } catch (error) {
    res.status(500).json({ error: "Error updating order status" });
  }
};

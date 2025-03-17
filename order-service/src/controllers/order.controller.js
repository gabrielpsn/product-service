const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const { calculateFreight } = require("../services/shipping.service");
const productService = require("../services/product.service");

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingZipcode } = req.body;

    // Validação: precisa ter itens no pedido
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ error: "O pedido deve conter pelo menos um item." });
    }

    // Simulação de cálculo de frete (poderia ser um serviço externo)
    // Calculando o frete
    shippingCost = await calculateFreight(shippingZipcode);

    // Calcula o preço total
    const totalPrice =
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
      shippingCost;

    // Cria o pedido
    const order = await Order.create({ totalPrice, shippingCost });

    // Cria os itens do pedido
    const orderItems = items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    await OrderItem.bulkCreate(orderItems);

    for (const item of items) {
      await productService.decreaseProductStock(item.productId, item.quantity);
    }

    res
      .status(201)
      .json({ message: "Pedidos criado com sucesso!", data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar o pedido." });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: OrderItem });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar os pedidos." });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: OrderItem });

    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar o pedido." });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Status atualizado com sucesso!", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar o status do pedido." });
  }
};

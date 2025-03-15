const Product = require("../models/Product");

// Criar produto
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const product = await Product.create({ name, description, price, stock });
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar produto" });
  }
};

// Listar produtos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar produtos" });
  }
};

// Buscar um produto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Produto não encontrado" });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar produto" });
  }
};

// Atualizar um produto
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated)
      return res.status(404).json({ error: "Produto não encontrado" });

    const product = await Product.findByPk(req.params.id);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar produto" });
  }
};

// Excluir um produto
exports.deleteProduct = async (req, res) => {
  try {
    console.log(req.params.id);
    const deleted = await Product.destroy({
      where: { id: req.params.id },
    });
    console.log(deleted);
    if (!deleted)
      return res.status(404).json({ error: "Produto não encontrado" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Decremente o estoque de um produto específico.
 */
exports.decreaseStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    // Verificando se há estoque suficiente
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Estoque insuficiente" });
    }

    // Decremetando o estoque
    product.stock -= quantity;

    await product.save();

    return res
      .status(200)
      .json({ message: "Estoque atualizado com sucesso", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao atualizar o estoque", error: error.message });
  }
};

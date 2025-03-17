const Product = require("../models/Product");

// Criar produto
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    // Verificação de campos obrigatórios
    if (!name || !description || price == null || stock == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.create({ name, description, price, stock });
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ error: "Error creating product" });
  }
};

// Listar produtos
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ error: "Error searching for products" });
  }
};

// Buscar um produto por ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: "Error searching for product" });
  }
};

// Atualizar um produto
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) return res.status(404).json({ message: "Product not found" });

    const product = await Product.findByPk(req.params.id);
    return res
      .status(200)
      .json({ data: product, message: "Product updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Error updating product" });
  }
};

// Excluir um produto
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) return res.status(404).json({ message: "Product not found" });
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

    // Validações adicionais (opcional)
    if (!quantity) {
      return res.status(400).json({ message: "Quantidade é obrigatória" });
    }

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Verificando se há estoque suficiente
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Estoque insuficiente" });
    }

    // Decremetando o estoque
    product.stock -= quantity;

    await Product.update(product, {
      where: { id: product.id },
    });

    return res
      .status(200)
      .json({ message: "Estoque atualizado com sucesso", product });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao atualizar o estoque", error: error.message });
  }
};

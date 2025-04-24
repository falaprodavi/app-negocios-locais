const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const mongoose = require("mongoose");

// @desc    Obter todas as categorias
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Criar categoria
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Atualizar categoria
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res, next) => {
  try {
    // Verifica se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name }, // Apenas o nome pode ser editado
      {
        new: true, // Retorna a categoria atualizada
        runValidators: true, // Valida os dados antes de atualizar
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoria não encontrada",
      });
    }

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// @desc    Deletar categoria
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    // Verifica se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    // Verifica se a categoria existe
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoria não encontrada",
      });
    }

    // Verifica se há subcategorias vinculadas (opcional)
    const subCategoriesCount = await SubCategory.countDocuments({
      category: req.params.id,
    });

    if (subCategoriesCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Não é possível excluir: existem subcategorias vinculadas",
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: "Categoria removida com sucesso",
    });
  } catch (err) {
    next(err);
  }
};

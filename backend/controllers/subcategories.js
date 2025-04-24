const mongoose = require('mongoose'); // Adicione esta linha
const SubCategory = require("../models/SubCategory");
const Category = require("../models/Category");

// @desc    Obter todas as subcategorias (com filtro por categoria)
// @route   GET /api/subcategories?category=ID_DA_CATEGORIA
// @access  Public
exports.getSubCategories = async (req, res, next) => {
  try {
    let query = {};

    // Filtro por categoria (se fornecido na query string)
    if (req.query.category) {
      // Verifica se o ID da categoria é válido
      if (!mongoose.Types.ObjectId.isValid(req.query.category)) {
        return res.status(400).json({
          success: false,
          message: "ID de categoria inválido",
        });
      }

      query.category = req.query.category;
    }

    const subCategories = await SubCategory.find(query).populate({
      path: "category",
      select: "name _id", // Mostra apenas o nome e ID da categoria
    });

    res.status(200).json({
      success: true,
      count: subCategories.length,
      data: subCategories,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Criar subcategoria (vinculada a uma categoria)
// @route   POST /api/subcategories
// @access  Private/Admin
exports.createSubCategory = async (req, res, next) => {
  try {
    // Verifica se a categoria pai existe
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Categoria inválida",
      });
    }

    const subCategory = await SubCategory.create(req.body);
    res.status(201).json({
      success: true,
      data: subCategory,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Atualizar subcategoria
// @route   PUT /api/subcategories/:id
// @access  Private/Admin
exports.updateSubCategory = async (req, res, next) => {
  try {
    const subCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategoria não encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: subCategory,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Excluir subcategoria
// @route   DELETE /api/subcategories/:id
// @access  Private/Admin
exports.deleteSubCategory = async (req, res, next) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Subcategoria não encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

const Category = require("../models/Category");
const { uploadCategoryIcon } = require("../utils/fileUpload");
const fs = require("fs");
const path = require("path");

const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// @desc    Listar todas as categorias
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort("name");
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Obter categoria por ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoria não encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Criar categoria (com verificação de existência inativa)
// @route   POST /api/categories
exports.createCategory = [
  uploadCategoryIcon.single("icon"),
  async (req, res, next) => {
    try {
      const { name } = req.body;

      if (!name) {
        if (req.file) deleteFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Por favor, forneça o nome da categoria",
        });
      }

      // 1. Verifica se existe categoria ATIVA
      const existingActive = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        active: true,
      });

      if (existingActive) {
        if (req.file) deleteFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Categoria já existe",
        });
      }

      // 2. Verifica se existe categoria INATIVA
      const existingInactive = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        active: false,
      });

      if (existingInactive) {
        const updateData = {
          active: true,
        };

        if (req.file) {
          if (existingInactive.icon) {
            deleteFile(path.join("public", existingInactive.icon));
          }
          updateData.icon = `/uploads/categories/${req.file.filename}`;
        }

        const reactivatedCat = await Category.findByIdAndUpdate(
          existingInactive._id,
          updateData,
          { new: true }
        );

        return res.status(200).json({
          success: true,
          data: reactivatedCat,
          message: "Categoria reativada com sucesso",
        });
      }

      // 3. Cria nova categoria
      const newCategory = await Category.create({
        name: name.toLowerCase(),
        icon: req.file ? `/uploads/categories/${req.file.filename}` : null,
        active: true,
      });

      res.status(201).json({
        success: true,
        data: newCategory,
        message: "Categoria criada com sucesso",
      });
    } catch (err) {
      if (req.file) deleteFile(req.file.path);

      if (err.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Categoria já existe",
        });
      }
      next(err);
    }
  },
];

// @desc    Atualizar categoria
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = [
  uploadCategoryIcon.single("icon"),
  async (req, res, next) => {
    try {
      const { name } = req.body;
      const updates = { name };
      const category = await Category.findById(req.params.id);

      if (!category) {
        if (req.file) deleteFile(req.file.path);
        return res.status(404).json({
          success: false,
          message: "Categoria não encontrada",
        });
      }

      // Se enviou nova imagem
      if (req.file) {
        // Remove a imagem antiga se existir
        if (category.icon) {
          const oldPath = path.join("public", category.icon);
          deleteFile(oldPath);
        }
        updates.icon = `/uploads/categories/${req.file.filename}`;
      }

      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        data: updatedCategory,
      });
    } catch (err) {
      if (req.file) deleteFile(req.file.path);
      next(err);
    }
  },
];

// @desc    Desativar categoria (soft delete)
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res, next) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoria não encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
      message: "Categoria desativada",
    });
  } catch (err) {
    next(err);
  }
};

const SubCategory = require("../models/SubCategory");
const { uploadSubCategoryIcon } = require("../utils/fileUpload");
const fs = require("fs");
const path = require("path");

// Helper para deletar arquivos
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(path.join("public", filePath))) {
    fs.unlinkSync(path.join("public", filePath));
  }
};

// @desc    Criar subcategoria (com verificação de existência inativa)
// @route   POST /api/subcategories
exports.createSubCategory = [
  uploadSubCategoryIcon.single("icon"),
  async (req, res, next) => {
    try {
      const { name, category } = req.body;

      // Verificação básica dos campos
      if (!name || !category) {
        if (req.file) deleteFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Por favor, forneça o nome da subcategoria e a categoria",
        });
      }

      // 1. Verifica se já existe uma subcategoria ATIVA
      const existingActive = await SubCategory.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        category,
        active: true,
      });

      if (existingActive) {
        if (req.file) deleteFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Subcategoria já existe nesta categoria",
        });
      }

      // 2. Verifica se existe uma subcategoria INATIVA (para reativar)
      const existingInactive = await SubCategory.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        category,
        active: false,
      });

      if (existingInactive) {
        // Prepara os dados para atualização
        const updateData = {
          active: true,
        };

        // Se foi enviado um novo ícone, atualiza o caminho
        if (req.file) {
          // Remove o ícone antigo se existir
          if (existingInactive.icon) {
            deleteFile(
              existingInactive.icon.replace("/uploads/subcategories/", "")
            );
          }
          updateData.icon = `/uploads/subcategories/${req.file.filename}`;
        }

        // Reativa a subcategoria existente
        const reactivatedSub = await SubCategory.findByIdAndUpdate(
          existingInactive._id,
          updateData,
          { new: true }
        );

        return res.status(200).json({
          success: true,
          data: reactivatedSub,
          message: "Subcategoria reativada com sucesso",
        });
      }

      // 3. Se não existir nenhum registro (nem ativo nem inativo), cria novo
      const newSubCategory = await SubCategory.create({
        name: name.toLowerCase(),
        category,
        icon: req.file ? `/uploads/subcategories/${req.file.filename}` : "",
        active: true,
      });

      res.status(201).json({
        success: true,
        data: newSubCategory,
        message: "Subcategoria criada com sucesso",
      });
    } catch (err) {
      if (req.file) deleteFile(req.file.path);

      // Tratamento de erros do MongoDB
      if (err.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "ID da categoria inválido",
        });
      }
      next(err);
    }
  },
];

// @desc    Listar todas as subcategorias (com filtros)
// @route   GET /api/subcategories
exports.getSubCategories = async (req, res, next) => {
  try {
    const { category, active } = req.query;
    const query = {};

    if (category) query.category = category;
    if (active) query.active = active === "true";

    const subCategories = await SubCategory.find(query)
      .populate("category", "name")
      .sort("name");

    res.status(200).json({
      success: true,
      count: subCategories.length,
      data: subCategories,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Atualizar subcategoria
// @route   PUT /api/subcategories/:id
exports.updateSubCategory = [
  uploadSubCategoryIcon.single("icon"),
  async (req, res, next) => {
    try {
      const { name, category, active } = req.body;
      const subCategory = await SubCategory.findById(req.params.id);

      if (!subCategory) {
        if (req.file) deleteFile(req.file.path);
        return res.status(404).json({
          success: false,
          message: "Subcategoria não encontrada",
        });
      }

      // Atualizações
      if (name) subCategory.name = name.toLowerCase();
      if (category) subCategory.category = category;
      if (active !== undefined) subCategory.active = active;

      // Atualiza ícone se fornecido
      if (req.file) {
        if (subCategory.icon) deleteFile(subCategory.icon);
        subCategory.icon = `/uploads/subcategories/${req.file.filename}`;
      }

      await subCategory.save();

      res.status(200).json({
        success: true,
        data: subCategory,
      });
    } catch (err) {
      if (req.file) deleteFile(req.file.path);
      next(err);
    }
  },
];

// @desc    Excluir subcategoria (soft delete)
// @route   DELETE /api/subcategories/:id
exports.deleteSubCategory = async (req, res, next) => {
  try {
    const subCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
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
      message: "Subcategoria desativada",
    });
  } catch (err) {
    next(err);
  }
};

const Business = require("../models/Business");
const { deleteFile } = require("../utils/fileUpload");
const fs = require("fs");
const path = require("path");

// @desc    Criar estabelecimento
// @route   POST /api/businesses
// @access  Private
exports.createBusiness = async (req, res, next) => {
  try {
    // Adiciona o dono automaticamente (do usuário autenticado)
    req.body.owner = req.user.id;

    const business = await Business.create(req.body);

    res.status(201).json({
      success: true,
      data: business,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }
    next(err);
  }
};

// @desc    Listar todos os estabelecimentos (com filtros)
// @route   GET /api/businesses
// @access  Public
exports.getBusinesses = async (req, res, next) => {
  try {
    const { city, category, subCategory, neighborhood } = req.query;
    const query = {};

    // Filtros
    if (city) query["address.city"] = city;
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (neighborhood) query["address.neighborhood"] = neighborhood;

    const businesses = await Business.find(query)
      .populate("address.city", "name")
      .populate("address.neighborhood", "name")
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("owner", "name email");

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Obter estabelecimento por ID
// @route   GET /api/businesses/:id
// @access  Public
exports.getBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate("address.city", "name")
      .populate("address.neighborhood", "name")
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("owner", "name email");

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Estabelecimento não encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: business,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Atualizar estabelecimento
// @route   PUT /api/businesses/:id
// @access  Private (Dono ou Admin)
exports.updateBusiness = async (req, res, next) => {
  try {
    let business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Estabelecimento não encontrado",
      });
    }

    // Verifica se o usuário é o dono ou admin
    if (
      business.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Não autorizado a atualizar este estabelecimento",
      });
    }

    business = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: business,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete business
// @route   DELETE /api/v1/businesses/:id
// @access  Private
exports.deleteBusiness = async (req, res, next) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      });
    }

    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business não encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: business,
      message: "Business desativado",
    });
  } catch (err) {
    next(err);
  }
};
// @desc    Upload de fotos para estabelecimento
// @route   PUT /api/businesses/:id/photos
// @access  Private (Dono ou Admin)
exports.uploadBusinessPhotos = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Por favor, envie pelo menos uma foto",
      });
    }

    const business = await Business.findById(req.params.id);

    if (!business) {
      // Remove arquivos enviados se o business não existir
      req.files.forEach((file) => deleteFile(file.path));
      return res.status(404).json({
        success: false,
        message: "Estabelecimento não encontrado",
      });
    }

    // Verifica se o usuário é o dono ou admin
    if (
      business.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      req.files.forEach((file) => deleteFile(file.path));
      return res.status(403).json({
        success: false,
        message: "Não autorizado a atualizar este estabelecimento",
      });
    }

    // Adiciona novas fotos (URLs fictícias - substitua pelo seu serviço de upload)
    const photos = req.files.map(
      (file) => `/uploads/businesses/${file.filename}`
    );

    business.photos = [...business.photos, ...photos];
    await business.save();

    res.status(200).json({
      success: true,
      data: business.photos,
    });
  } catch (err) {
    req.files.forEach((file) => deleteFile(file.path));
    next(err);
  }
};

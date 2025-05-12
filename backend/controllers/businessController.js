const City = require("../models/City");
const Neighborhood = require("../models/Neighborhood");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Business = require("../models/Business");


// Criar um novo estabelecimento
exports.createBusiness = async (req, res) => {
  try {
    const photos = req.files.map(
      (file) =>
        `${req.protocol}://${req.get("host")}/uploads/businesses/${
          file.filename
        }`
    );
    const business = await Business.create({
      ...req.body,
      photos,
      owner: req.user._id,
    });
    res.status(201).json({ success: true, data: business });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Listar todos os estabelecimentos
exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find().populate(
      "category subCategory address.city address.neighborhood owner"
    );
    res.json({ success: true, data: businesses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Buscar os últimos estabelecimentos cadastrados
exports.getLatestBusinesses = async (req, res) => {
  const limit = parseInt(req.query.limit) || 4;
  try {
    const businesses = await Business.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("category subCategory address.city address.neighborhood");
    res.json({ success: true, data: businesses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Buscar um único estabelecimento
exports.getBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id).populate(
      "category subCategory address.city address.neighborhood owner"
    );
    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Estabelecimento não encontrado" });
    }
    res.json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Atualizar um estabelecimento
exports.updateBusiness = async (req, res) => {
  try {
    const updated = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Estabelecimento não encontrado" });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Excluir um estabelecimento
exports.deleteBusiness = async (req, res) => {
  try {
    const deleted = await Business.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Estabelecimento não encontrado" });
    }
    res.json({
      success: true,
      message: "Estabelecimento removido com sucesso",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchBusinesses = async (req, res) => {
  try {
    const { name, city, category, neighborhood, subCategory } = req.query;
    const query = {};

    // Busca por nome parcial (regex, insensível a maiúsculas)
    if (name) query.name = { $regex: name, $options: "i" };

    // Buscar cidade por nome (e incluir ID no query)
    if (city) {
      const cityDoc = await City.findOne({
        name: { $regex: city, $options: "i" },
      });
      if (cityDoc) query["address.city"] = cityDoc._id;
    }

    // Buscar bairro por nome
    if (neighborhood) {
      const neighborhoodDoc = await Neighborhood.findOne({
        name: { $regex: neighborhood, $options: "i" },
      });
      if (neighborhoodDoc) query["address.neighborhood"] = neighborhoodDoc._id;
    }

    // Buscar categoria por nome
    if (category) {
      const categoryDoc = await Category.findOne({
        name: { $regex: category, $options: "i" },
      });
      if (categoryDoc) query.category = categoryDoc._id;
    }

    // Buscar subcategoria por nome
    if (subCategory) {
      const subCategoryDoc = await SubCategory.findOne({
        name: { $regex: subCategory, $options: "i" },
      });
      if (subCategoryDoc) query.subCategory = subCategoryDoc._id;
    }

    const results = await Business.find(query).populate(
      "category subCategory address.city address.neighborhood"
    );

    res.json({ success: true, data: results });
  } catch (error) {
    console.error("Erro na busca:", error);
    res.status(500).json({ success: false, message: "Erro no servidor" });
  }
};

exports.getBusinessBySlug = async (req, res) => {
  try {
    const business = await Business.findOne({ slug: req.params.slug }).populate(
      "category subCategory address.city address.neighborhood owner"
    );

    if (!business) {
      return res
        .status(404)
        .json({ success: false, message: "Não encontrado" });
    }

    res.json({ success: true, data: business });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

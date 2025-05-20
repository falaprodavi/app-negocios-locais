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

const searchBusinesses = async (req, res) => {
  try {
    const {
      name,
      citySlug,
      neighborhoodSlug,
      categorySlug,
      subCategorySlug,
    } = req.query;

    const filter = {};

    if (citySlug) {
      const city = await City.findOne({ slug: citySlug });
      if (city) filter["address.city"] = city._id;
    }

    if (neighborhoodSlug) {
      const neighborhood = await Neighborhood.findOne({
        slug: neighborhoodSlug,
      });
      if (neighborhood) filter["address.neighborhood"] = neighborhood._id;
    }

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) filter.category = category._id;
    }

    if (subCategorySlug) {
      const subCategory = await SubCategory.findOne({ slug: subCategorySlug });
      if (subCategory) filter.subCategory = subCategory._id;
    }

    if (name) {
      filter.name = { $regex: name, $options: "i" }; // busca parcial e case-insensitive
    }

    const businesses = await Business.find(filter)
      .populate("category")
      .populate("subCategory")
      .populate("address.city")
      .populate("address.neighborhood");

    res.json({ success: true, data: businesses });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar estabelecimentos" });
  }
};

// Buscar os últimos estabelecimentos cadastrados
exports.getLatestBusinesses = async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
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
// Atualizar um estabelecimento
exports.updateBusiness = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // Se houver arquivos enviados, processá-los
    if (req.files && req.files.length > 0) {
      const photos = req.files.map(
        (file) =>
          `${req.protocol}://${req.get("host")}/uploads/businesses/${
            file.filename
          }`
      );

      // Se for para adicionar às fotos existentes
      if (req.body.photosAction === "append") {
        const business = await Business.findById(req.params.id);
        updateData.photos = [...business.photos, ...photos];
      }
      // Se for para substituir todas as fotos
      else {
        updateData.photos = photos;
      }
    }

    const updated = await Business.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

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
    const {
      name,
      city,
      neighborhood,
      category,
      subcategory,
      page = 1, // Adicionado
      perPage = 9, // Adicionado
    } = req.query;

    const filter = {};

    // Filtros existentes (mantidos iguais)
    if (name) filter.name = { $regex: name, $options: "i" };

    if (city) {
      const cityDoc = await City.findOne({ slug: city });
      if (cityDoc) filter["address.city"] = cityDoc._id;
    }

    if (neighborhood) {
      const neighborhoodDoc = await Neighborhood.findOne({
        slug: neighborhood,
      });
      if (neighborhoodDoc) filter["address.neighborhood"] = neighborhoodDoc._id;
    }

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) filter.category = categoryDoc._id;
    }

    if (subcategory) {
      const subCategoryDoc = await SubCategory.findOne({ slug: subcategory });
      if (subCategoryDoc) filter.subCategory = subCategoryDoc._id;
    }

    // Cálculos de paginação
    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(perPage);
    const skip = (currentPage - 1) * itemsPerPage;

    // Busca paginada (usando Promise.all para performance)
    const [businesses, totalCount] = await Promise.all([
      Business.find(filter)
        .skip(skip)
        .limit(itemsPerPage)
        .populate(
          "category subCategory address.city address.neighborhood owner"
        )
        .lean(),

      Business.countDocuments(filter), // Conta o total de documentos
    ]);

    // Formatação dos resultados
    const formattedBusinesses = businesses.map((business) => ({
      ...business,
      citySlug: business.address.city?.slug,
      neighborhoodSlug: business.address.neighborhood?.slug,
      categorySlug: business.category?.slug,
      subCategorySlug: business.subCategory?.slug,
    }));

    // Resposta com metadados de paginação
    res.json({
      success: true,
      data: formattedBusinesses,
      pagination: {
        page: currentPage,
        perPage: itemsPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Erro na busca",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
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

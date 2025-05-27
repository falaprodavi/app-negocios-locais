const City = require("../models/City");
const Neighborhood = require("../models/Neighborhood");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Business = require("../models/Business");
const path = require("path");


exports.getDashboardStats = async (req, res) => {
  try {
    const totalBusinesses = await Business.countDocuments();
    const totalCities = await City.countDocuments();
    const totalCategories = await Category.countDocuments();

    res.json({
      success: true,
      data: {
        totalBusinesses,
        totalCities,
        totalCategories,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getRecentBusinesses = async (req, res) => {
  console.log("✅ Rota acessada em:", new Date()); // ← Deve aparecer no terminal

  try {
    const businesses = await Business.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("address.city", "name")
      .populate("category", "name")
      .select("name photos createdAt slug");

    res.json({
      success: true,
      data: businesses, // ← Formato padronizado
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Criar um novo estabelecimento
exports.createBusiness = async (req, res) => {
  try {
    const photos = req.files.map(
      (file) =>
        `${req.protocol}://${req.get(
          "host"
        )}/uploads/businesses/${path.basename(
          file.optimizedPath || file.filename
        )}`
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
exports.updateBusiness = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      const photos = req.files.map(
        (file) =>
          `${req.protocol}://${req.get(
            "host"
          )}/uploads/businesses/${path.basename(
            file.optimizedPath || file.filename
          )}`
      );

      if (req.body.photosAction === "append") {
        const business = await Business.findById(req.params.id);
        updateData.photos = [...business.photos, ...photos];
      } else {
        updateData.photos = photos;
      }
    } else {
      delete updateData.photos;
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
      city, // Mantemos o nome original do parâmetro
      neighborhood, // Mantemos o nome original do parâmetro
      category,
      subcategory,
      page = 1,
      perPage = 9,
    } = req.query;

    const filter = {};

    // Filtro por nome (mantido igual)
    if (name) filter.name = { $regex: name, $options: "i" };

    // 1. Primeiro encontra a cidade (se especificada)
    let cityId;
    if (city) {
      // Agora usando 'city' em vez de 'citySlug'
      const cityDoc = await City.findOne({ slug: city });
      if (!cityDoc) {
        return res.json({
          success: true,
          data: [],
          message: "Cidade não encontrada",
        });
      }
      cityId = cityDoc._id;
      filter["address.city"] = cityId;
    }

    // 2. Filtro de bairro (agora vinculado à cidade)
    if (neighborhood) {
      // Agora usando 'neighborhood' em vez de 'neighborhoodSlug'
      const neighborhoodFilter = { slug: neighborhood };
      if (cityId) neighborhoodFilter.city = cityId; // Filtro combinado

      const neighborhoodDoc = await Neighborhood.findOne(neighborhoodFilter);
      if (!neighborhoodDoc) {
        return res.json({
          success: true,
          data: [],
          message: "Bairro não encontrado nesta cidade",
        });
      }
      filter["address.neighborhood"] = neighborhoodDoc._id;
    }

    // Restante dos filtros (mantidos iguais)
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) filter.category = categoryDoc._id;
    }

    if (subcategory) {
      const subCategoryDoc = await SubCategory.findOne({ slug: subcategory });
      if (subCategoryDoc) filter.subCategory = subCategoryDoc._id;
    }

    // Paginação (mantida igual)
    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(perPage);
    const skip = (currentPage - 1) * itemsPerPage;

    const [businesses, totalCount] = await Promise.all([
      Business.find(filter)
        .skip(skip)
        .limit(itemsPerPage)
        .populate(
          "category subCategory address.city address.neighborhood owner"
        )
        .lean(),
      Business.countDocuments(filter),
    ]);

    // Formatação dos resultados (mantida igual)
    const formattedBusinesses = businesses.map((business) => ({
      ...business,
      citySlug: business.address.city?.slug,
      neighborhoodSlug: business.address.neighborhood?.slug,
      categorySlug: business.category?.slug,
      subCategorySlug: business.subCategory?.slug,
    }));

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

exports.getBusinessesByDate = async (req, res) => {
  try {
    const businesses = await Business.find({})
      .select("createdAt")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: businesses,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

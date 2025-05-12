const City = require("../models/City");
const { uploadCityImage } = require("../utils/fileUpload");
const fs = require("fs");
const path = require("path");
const Business = require("../models/Business"); // Adicione esta linha

const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(path.join("public", filePath))) {
    fs.unlinkSync(path.join("public", filePath));
  }
};

// @desc    Listar todas as cidades ativas
// @route   GET /api/cities
// @access  Public
exports.getCities = async (req, res, next) => {
  try {
    const cities = await City.find({ active: true }).sort("name");
    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Obter cidade por ID
// @route   GET /api/cities/:id
// @access  Public
exports.getCityById = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city || !city.active) {
      return res.status(404).json({
        success: false,
        message: "Cidade não encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: city,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Criar cidade
// @route   POST /api/cities
// @access  Private/Admin
exports.createCity = [
  uploadCityImage.single("image"),
  async (req, res, next) => {
    try {
      const { name } = req.body;

      // Verifica se já existe (case-insensitive)
      const existingCity = await City.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
      });

      if (existingCity) {
        if (req.file) deleteFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Cidade já existe",
        });
      }

      const city = await City.create({
        name: name.toLowerCase(),
        image: req.file ? `/uploads/cities/${req.file.filename}` : "",
      });

      res.status(201).json({
        success: true,
        data: city,
      });
    } catch (err) {
      if (req.file) deleteFile(req.file.path);
      next(err);
    }
  },
];

// @desc    Atualizar cidade
// @route   PUT /api/cities/:id
// @access  Private/Admin
exports.updateCity = [
  uploadCityImage.single("image"),
  async (req, res, next) => {
    try {
      const { name } = req.body;
      const city = await City.findById(req.params.id);

      if (!city) {
        if (req.file) deleteFile(req.file.path);
        return res.status(404).json({
          success: false,
          message: "Cidade não encontrada",
        });
      }

      // Verifica duplicata
      if (name) {
        const existingCity = await City.findOne({
          name: { $regex: new RegExp(`^${name}$`, "i") },
          _id: { $ne: city._id },
        });

        if (existingCity) {
          if (req.file) deleteFile(req.file.path);
          return res.status(400).json({
            success: false,
            message: "Cidade já existe",
          });
        }
        city.name = name.toLowerCase();
      }

      // Atualiza imagem se fornecida
      if (req.file) {
        if (city.image) deleteFile(city.image);
        city.image = `/uploads/cities/${req.file.filename}`;
      }

      await city.save();

      res.status(200).json({
        success: true,
        data: city,
      });
    } catch (err) {
      if (req.file) deleteFile(req.file.path);
      next(err);
    }
  },
];

// @desc    Excluir cidade (soft delete)
// @route   DELETE /api/cities/:id
// @access  Private/Admin
exports.deleteCity = async (req, res, next) => {
  try {
    const city = await City.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "Cidade não encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: city,
      message: "Cidade desativada",
    });
  } catch (err) {
    next(err);
  }
};

exports.getPopularCities = async (req, res, next) => {
  try {
    // Método 100% funcional - sem aggregation
    const businesses = await Business.find({ 'address.city': { $exists: true } });
    
    // Contagem manual
    const cityCounts = {};
    businesses.forEach(b => {
      const cityId = b.address.city?._id?.toString();
      if (cityId) {
        cityCounts[cityId] = (cityCounts[cityId] || 0) + 1;
      }
    });
    
    // Pega os top 8
    const topCityIds = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([id]) => id);
    
    // Busca dados das cidades
    const cities = await City.find({ _id: { $in: topCityIds } });
    
    // Formata resposta
    const result = cities.map(city => ({
      _id: city._id,
      name: city.name,
      image: city.image,
      businessCount: cityCounts[city._id.toString()]
    })).sort((a, b) => b.businessCount - a.businessCount);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const Neighborhood = require("../models/Neighborhood");
const City = require("../models/City");

// @desc    Criar bairro (com verificação de existência)
// @route   POST /api/neighborhoods
exports.createNeighborhood = async (req, res, next) => {
  try {
    const { name, city } = req.body;

    // Verificação básica dos campos
    if (!name || !city) {
      return res.status(400).json({
        success: false,
        message: "Por favor, forneça o nome do bairro e a cidade",
      });
    }

    // 1. Verifica se já existe um bairro ATIVO
    const existingActive = await Neighborhood.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      city,
      active: true,
    });

    if (existingActive) {
      return res.status(400).json({
        success: false,
        message: "Bairro já existe nesta cidade",
      });
    }

    // 2. Verifica se existe um bairro INATIVO (para reativar)
    const existingInactive = await Neighborhood.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      city,
      active: false,
    });

    if (existingInactive) {
      // Reativa o bairro existente
      const reactivated = await Neighborhood.findByIdAndUpdate(
        existingInactive._id,
        { active: true },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        data: reactivated,
        message: "Bairro reativado com sucesso",
      });
    }

    // 3. Se não existir nenhum registro (nem ativo nem inativo), cria novo
    const newNeighborhood = await Neighborhood.create({
      name: name.toLowerCase(),
      city,
      active: true,
    });

    res.status(201).json({
      success: true,
      data: newNeighborhood,
      message: "Bairro criado com sucesso",
    });
  } catch (err) {
    // Tratamento de erros do MongoDB
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "ID da cidade inválido",
      });
    }
    next(err);
  }
};

// @desc    Listar bairros por cidade
// @route   GET /api/cities/:cityId/neighborhoods
exports.getNeighborhoodsByCity = async (req, res, next) => {
  try {
    console.log("Chegou no controller"); // Para debug

    if (!req.params.cityId) {
      return res.status(400).json({
        success: false,
        message: "ID da cidade não fornecido",
      });
    }

    const neighborhoods = await Neighborhood.find({
      city: req.params.cityId,
      active: true,
    }).populate("city", "name");

    console.log("Bairros encontrados:", neighborhoods); // Para debug

    if (!neighborhoods || neighborhoods.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nenhum bairro encontrado para esta cidade",
      });
    }

    res.status(200).json({
      success: true,
      count: neighborhoods.length,
      data: neighborhoods,
    });
  } catch (err) {
    console.error("Erro no controller:", err); // Para debug
    next(err);
  }
};

// @desc    Listar todas as subcategorias (com filtros)
// @route   GET /api/bairros
exports.getNeighborhoods = async (req, res, next) => {
  try {
    const { city, active } = req.query;
    const query = {};

    if (city) query.city = city;
    if (active) query.active = active === "true";

    const neighborhoods = await Neighborhood.find(query)
      .populate("city", "name")
      .sort("name");

    res.status(200).json({
      success: true,
      count: neighborhoods.length,
      data: neighborhoods,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Atualizar bairro
// @route   PUT /api/neighborhoods/:id
exports.updateNeighborhood = async (req, res, next) => {
  try {
    // Verifica se req.body existe
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Nenhum dado fornecido para atualização",
      });
    }

    const { name, city } = req.body;
    const neighborhood = await Neighborhood.findById(req.params.id);

    if (!neighborhood) {
      return res.status(404).json({
        success: false,
        message: "Bairro não encontrado",
      });
    }

    // Verifica nova cidade
    if (city && city !== neighborhood.city.toString()) {
      const newCity = await City.findById(city);
      if (!newCity) {
        return res.status(400).json({
          success: false,
          message: "Cidade inválida",
        });
      }
    }

    // Verifica duplicata
    if (name) {
      const existingNeighborhood = await Neighborhood.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        city: city || neighborhood.city,
        _id: { $ne: neighborhood._id },
      });

      if (existingNeighborhood) {
        return res.status(400).json({
          success: false,
          message: "Bairro já existe nesta cidade",
        });
      }
      neighborhood.name = name.toLowerCase();
    }

    if (city) neighborhood.city = city;
    await neighborhood.save();

    res.status(200).json({
      success: true,
      data: neighborhood,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      });
    }
    next(err);
  }
};

// @desc    Desativar bairro (soft delete)
// @route   DELETE /api/neighborhoods/:id
exports.deleteNeighborhood = async (req, res, next) => {
  try {
    // Verifica se o ID é válido
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID inválido",
      });
    }

    const neighborhood = await Neighborhood.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!neighborhood) {
      return res.status(404).json({
        success: false,
        message: "Bairro não encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: neighborhood,
      message: "Bairro desativado",
    });
  } catch (err) {
    next(err);
  }
};

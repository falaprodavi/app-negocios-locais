const Business = require("../models/Business");
const City = require("../models/City");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");

exports.getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar categorias." });
  }
};

exports.getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ error: "Cidade não encontrada." });
    res.json(city);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar cidade por ID." });
  }
};

exports.getCityBySlug = async (req, res) => {
  try {
    const city = await City.findOne({ slug: req.params.slug });
    if (!city) return res.status(404).json({ error: "Cidade não encontrada." });
    res.json(city);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar cidade por slug." });
  }
};

exports.createCity = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "O campo 'name' é obrigatório." });
    }

    let image = null;
    if (req.file) {
      image = `${req.protocol}://${req.get("host")}/uploads/cities/${
        req.file.filename
      }`;
    }

    const slug = slugify(name, { lower: true, strict: true });

    const city = new City({ name, slug, image });
    await city.save();
    res.status(201).json(city);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ error: "Erro ao criar cidade.", detail: err.message });
  }
};

exports.updateCity = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;
    let image;

    if (file) {
      image = `${req.protocol}://${req.get("host")}/uploads/cities/${
        file.filename
      }`;
    }

    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
    }
    if (image) {
      updateData.image = image;
    }

    const updatedCity = await City.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCity) {
      return res.status(404).json({ error: "Cidade não encontrada." });
    }

    res.json(updatedCity);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ error: "Erro ao atualizar cidade.", detail: err.message });
  }
};

exports.deleteCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ error: "Cidade não encontrada." });

    if (city.image) {
      fs.unlinkSync(path.resolve(city.image));
    }

    await city.deleteOne();
    res.json({ message: "Cidade deletada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar cidade." });
  }
};

exports.getPopularCities = async (req, res) => {
  try {
    const result = await Business.aggregate([
      {
        $group: {
          _id: "$address.city",
          totalBusinesses: { $sum: 1 },
        },
      },
      { $sort: { totalBusinesses: -1 } },
      { $limit: 8 },
      {
        $lookup: {
          from: "cities",
          localField: "_id",
          foreignField: "_id",
          as: "city",
        },
      },
      { $unwind: "$city" },
      {
        $project: {
          _id: "$city._id",
          name: "$city.name",
          slug: "$city.slug",
          image: "$city.image",
          totalBusinesses: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar cidades populares",
    });
  }
};

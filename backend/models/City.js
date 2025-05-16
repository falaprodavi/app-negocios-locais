// models/Category.js
const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String }, // Caminho do arquivo da imagem
});

module.exports = mongoose.model("City", CitySchema);

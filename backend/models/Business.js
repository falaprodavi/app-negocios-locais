// models/Business.js
const mongoose = require("mongoose");
const slugify = require("slugify");

const BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "O nome do estabelecimento é obrigatório"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "A descrição é obrigatória"],
  },
  phone: {
    type: String,
    required: [true, "O telefone é obrigatório"],
  },
  whatsapp: String,
  photos: [String],
  video: String,
  instagram: String,
  facebook: String,
  linkedin: String,
  twitter: String,
  tiktok: String,
  site: String,
  address: {
    street: {
      type: String,
    },
    number: {
      type: String,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: [true, "Selecione uma cidade"],
    },
    neighborhood: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Neighborhood",
      required: [true, "Selecione um bairro"],
    },
  },
  lat: {
    type: String,
  },
  long: {
    type: String,
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Selecione pelo menos uma categoria"],
    },
  ],
  subCategory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: [true, "Selecione pelo menos uma subcategoria"],
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    unique: true,
  },
});

// Gera o slug automaticamente antes de salvar
BusinessSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = slugify(this.name, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model("Business", BusinessSchema);

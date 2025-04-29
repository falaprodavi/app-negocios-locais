const mongoose = require("mongoose");

const NeighborhoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome do bairro é obrigatório"],
      trim: true,
      lowercase: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: [true, "A cidade é obrigatória"],
      validate: {
        validator: async function (value) {
          const city = await mongoose.model("City").findById(value);
          return city !== null;
        },
        message: "Cidade inválida",
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collation: { locale: "pt", strength: 2 }, // Busca case-insensitive
  }
);

// Índice para evitar duplicatas (nome + cidade)
NeighborhoodSchema.index(
  { name: 1, city: 1 },
  { unique: true, collation: { locale: "pt", strength: 1 } }
);

module.exports = mongoose.model("Neighborhood", NeighborhoodSchema);

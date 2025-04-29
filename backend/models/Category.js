const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "O nome da categoria é obrigatório"],
      trim: true,
      lowercase: true,
    },
    icon: String,
    active: { 
      type: Boolean, 
      default: true 
    },
  },
  {
    collation: { locale: "pt", strength: 2 }, // Configuração case-insensitive
    // Removemos o unique: true do schema e usamos apenas o índice abaixo
  }
);

// Definimos o índice único com collation diretamente
CategorySchema.index(
  { name: 1 }, 
  { 
    unique: true,
    collation: { locale: 'pt', strength: 2 },
    partialFilterExpression: { active: true } // Só aplica unicidade para documentos ativos
  }
);

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    trim: true,
    lowercase: true,
    maxlength: [50, 'Máximo de 50 caracteres']
  },
  icon: {
    type: String,
    default: ''
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'A categoria é obrigatória'],
    validate: {
      validator: async function(value) {
        const category = await mongoose.model('Category').findById(value);
        return !!category;
      },
      message: 'Categoria não encontrada'
    }
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  collation: { locale: 'pt', strength: 2 } // Busca case-insensitive
});

// Índice para evitar duplicatas (nome + categoria)
SubCategorySchema.index(
  { name: 1, category: 1 }, 
  { unique: true, collation: { locale: 'pt', strength: 1 } }
);

module.exports = mongoose.model('SubCategory', SubCategorySchema);
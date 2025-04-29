const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome da cidade é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true
  },
  image: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  collation: { locale: 'pt', strength: 2 } // Busca case-insensitive
});

module.exports = mongoose.model('City', CitySchema);
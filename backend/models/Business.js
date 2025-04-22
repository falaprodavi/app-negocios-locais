const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor adicione um nome'],
    trim: true,
    maxlength: [50, 'Nome não pode ter mais que 50 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Por favor adicione uma descrição'],
    maxlength: [500, 'Descrição não pode ter mais que 500 caracteres']
  },
  address: {
    city: {
      type: String,
      required: true
    },
    neighborhood: {
      type: String,
      required: true
    },
    street: String,
    number: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Restaurante', 'Loja', 'Serviço', 'Entretenimento', 
      'Saúde', 'Educação', 'Automotivo', 'Outros'
    ]
  },
  subCategory: {
    type: String,
    required: true
  },
  contact: {
    phone: String,
    whatsapp: String,
    email: String,
    website: String
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
  },
  gallery: [String],
  video: String,
  openingHours: [
    {
      day: {
        type: String,
        enum: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
      },
      hours: String,
      open: Boolean
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Business', BusinessSchema);
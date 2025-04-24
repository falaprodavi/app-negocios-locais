const mongoose = require("mongoose");

const NeighborhoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "O nome do bairro é obrigatório"],
    trim: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: [true, "Selecione uma cidade"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Neighborhood", NeighborhoodSchema);

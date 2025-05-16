const mongoose = require("mongoose");

const NeighborhoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true }
});

module.exports = mongoose.model("Neighborhood", NeighborhoodSchema);
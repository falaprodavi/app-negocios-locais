const Neighborhood = require('../models/Neighborhood');

exports.getNeighborhoods = async (req, res) => {
  const neighborhoods = await Neighborhood.find().populate('city');
  res.json(neighborhoods);
};

exports.addNeighborhood = async (req, res) => {
  const neighborhood = await Neighborhood.create(req.body);
  res.status(201).json(neighborhood);
};
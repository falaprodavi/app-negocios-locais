const City = require('../models/City');

exports.getCities = async (req, res) => {
  const cities = await City.find();
  res.json(cities);
};

exports.addCity = async (req, res) => {
  const city = await City.create(req.body);
  res.status(201).json(city);
};
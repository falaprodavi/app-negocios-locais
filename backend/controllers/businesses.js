const Business = require('../models/Business');

exports.getBusinesses = async (req, res) => {
  const businesses = await Business.find()
    .populate('city neighborhood category subCategory');
  res.json(businesses);
};

exports.addBusiness = async (req, res) => {
  const business = await Business.create({ ...req.body, owner: req.user.id });
  res.status(201).json(business);
};
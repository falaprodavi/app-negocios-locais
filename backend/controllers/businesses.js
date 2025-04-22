const Business = require('../models/Business');

// @desc    Obter todos os negócios
// @route   GET /api/businesses
// @access  Public
exports.getBusinesses = async (req, res, next) => {
  try {
    // Filtros
    const { city, neighborhood, category, subCategory } = req.query;
    
    const query = {};
    
    if (city) query['address.city'] = city;
    if (neighborhood) query['address.neighborhood'] = neighborhood;
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;

    const businesses = await Business.find(query);
    
    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Obter um único negócio
// @route   GET /api/businesses/:id
// @access  Public
exports.getBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Negócio não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: business
    });
  } catch (err) {
    next(err);
  }
};
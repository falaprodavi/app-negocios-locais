const express = require('express');
const {
  getCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity
} = require('../controllers/cities');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Rotas públicas
router.get('/', getCities);
router.get('/:id', getCityById);

// Rotas protegidas (admin)
router.post('/', 
  protect, 
  authorize('admin'), 
  createCity
);

router.put('/:id', 
  protect, 
  authorize('admin'), 
  updateCity
);

router.delete('/:id', 
  protect, 
  authorize('admin'), 
  deleteCity
);

module.exports = router;
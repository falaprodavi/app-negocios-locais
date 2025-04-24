const express = require('express');
const { getCities, addCity } = require('../controllers/cities');
const router = express.Router();

router.route('/').get(getCities).post(addCity);
module.exports = router;
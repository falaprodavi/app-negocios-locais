const express = require('express');
const { getBusinesses, addBusiness } = require('../controllers/businesses');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/').get(getBusinesses).post(protect, addBusiness);
module.exports = router;
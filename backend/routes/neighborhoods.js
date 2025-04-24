const express = require('express');
const { getNeighborhoods, addNeighborhood } = require('../controllers/neighborhoods');
const router = express.Router();

router.route('/').get(getNeighborhoods).post(addNeighborhood);
module.exports = router;
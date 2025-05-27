const multer = require('multer');
const { storage } = require('../config/cloudinary');

const uploadBusinessPhotos = multer({ storage });

module.exports = { uploadBusinessPhotos };

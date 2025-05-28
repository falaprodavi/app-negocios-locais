const multer = require("multer");
const { storage, cityStorage } = require("../config/cloudinary");

const uploadBusinessPhotos = multer({ storage });
const uploadCityImage = multer({ storage: cityStorage });

module.exports = { uploadBusinessPhotos, uploadCityImage };

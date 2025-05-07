const express = require("express");
const router = express.Router();
const {
  createBusiness,
  getBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness,
  uploadBusinessPhotos,
} = require("../controllers/businesses");
const { protect, authorize } = require("../middleware/auth");
// Corrigindo a importação para usar fileUpload.js em vez de multer.js
const { uploadBusinessPhotos: upload } = require("../utils/fileUpload");

// Rotas públicas
router.route("/").get(getBusinesses);
router.route("/:id").get(getBusiness);

// Rotas protegidas
router.use(protect);

router.route("/").post(createBusiness);
router.route("/:id").put(updateBusiness).delete(deleteBusiness);
router.delete("/:id", protect, authorize("admin"), deleteBusiness);

// Upload de fotos (múltiplos arquivos)
router
  .route("/:id/photos")
  .put(upload.array("photos", 10), uploadBusinessPhotos);

module.exports = router;

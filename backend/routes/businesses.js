const express = require("express");
const router = express.Router();
const {
  createBusiness,
  getBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness,
  getLatestBusinesses,
  searchBusinesses,
} = require("../controllers/businessController");

const { protect, authorize } = require("../middleware/auth");
const {
  uploadBusinessCreate,
  uploadBusinessPhotos,
} = require("../utils/fileUpload");

router.get("/latest", getLatestBusinesses);

// GET /api/businesses/search
router.get("/search", searchBusinesses);

// Protege criação, edição e exclusão
router
  .route("/")
  .get(getBusinesses)
  .post(
    protect,
    authorize("admin", "owner"),
    uploadBusinessCreate,
    createBusiness
  );

router
  .route("/:id")
  .get(getBusiness)
  .put(
    protect,
    authorize("admin", "owner"),
    uploadBusinessPhotos.array("photos", 10),
    updateBusiness
  )
  .delete(protect, authorize("admin", "owner"), deleteBusiness);

module.exports = router;

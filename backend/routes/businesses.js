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
  getBusinessBySlug
} = require("../controllers/businessController");

const { protect, authorize } = require("../middleware/auth");
const { uploadBusinessCreate } = require("../utils/fileUpload");

router.get("/latest", getLatestBusinesses);

// GET /api/businesses/search?name=padaria&city=São Paulo&category=restaurante
router.get("/search", searchBusinesses);
router.get("/slug/:slug", getBusinessBySlug);



// Protege criação, edição e exclusão
router
  .route("/")
  .get(getBusinesses)
  .post(protect, authorize("admin", "owner"), uploadBusinessCreate, createBusiness);

router
  .route("/:id")
  .get(getBusiness)
  .put(protect, authorize("admin", "owner"), updateBusiness)
  .delete(protect, authorize("admin", "owner"), deleteBusiness);



module.exports = router;

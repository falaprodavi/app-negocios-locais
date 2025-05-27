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
  getBusinessBySlug,
  getDashboardStats,
  getRecentBusinesses,
  getBusinessesByDate,
} = require("../controllers/businessController");

const { optimizeUploadedImages } = require("../middleware/optimizeUploadedImages");

router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/recent-businesses", getRecentBusinesses);
router.get("/by-date", getBusinessesByDate);

router.get("/latest", getLatestBusinesses);
router.get("/slug/:slug", getBusinessBySlug);

const { protect, authorize } = require("../middleware/auth");
const {
  uploadBusinessCreate,
  uploadBusinessPhotos,
} = require("../utils/fileUpload");

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
    optimizeUploadedImages, 
    createBusiness
  );

router
  .route("/:id")
  .get(getBusiness)
  .put(
    protect,
    authorize("admin", "owner"),
    uploadBusinessPhotos.array("photos", 10),
    optimizeUploadedImages, 
    updateBusiness
  )
  .delete(protect, authorize("admin", "owner"), deleteBusiness);

module.exports = router;

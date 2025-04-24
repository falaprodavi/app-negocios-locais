const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");
const { protect, authorize } = require("../middleware/auth"); // Importe os middlewares

const router = express.Router();

// Rotas públicas
router.route("/").get(getCategories);

// Rotas protegidas (apenas admin)
router.route("/").post(protect, authorize("admin"), createCategory);

router
  .route("/:id")
  .put(protect, authorize("admin"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory);

module.exports = router;

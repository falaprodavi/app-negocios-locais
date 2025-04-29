const express = require("express");
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Rotas públicas
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Rotas protegidas (apenas admin)
router.post("/", protect, authorize("admin"), createCategory);
router.put("/:id", protect, authorize("admin"), updateCategory);
router.delete("/:id", protect, authorize("admin"), deleteCategory);

module.exports = router;

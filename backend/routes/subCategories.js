const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subCategories");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Rotas públicas
router.get("/", getSubCategories);

// Rotas protegidas (admin)
router.post("/", protect, authorize("admin"), createSubCategory);

router.put("/:id", protect, authorize("admin"), updateSubCategory);

router.delete("/:id", protect, authorize("admin"), deleteSubCategory);

module.exports = router;

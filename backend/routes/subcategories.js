const express = require("express");
const {
  getSubCategories,
  createSubCategory,
} = require("../controllers/subcategories");
const router = express.Router();

router.route("/").get(getSubCategories).post(createSubCategory);
module.exports = router;

const express = require("express");
const { addFavorite, removeFavorite } = require("../controllers/favorites");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.post("/", protect, addFavorite);
router.delete("/:id", protect, removeFavorite);
module.exports = router;

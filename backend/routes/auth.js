const express = require("express");
const {
  register,
  login,
  updateUser,
  deleteUser,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.route("/me").put(protect, updateUser).delete(protect, deleteUser);

module.exports = router;

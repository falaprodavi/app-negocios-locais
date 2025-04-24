const express = require("express");
const {
  register,
  login,
  updateUser,
  deleteUser,
  getUsers,
} = require("../controllers/auth");
const { protect, authorize } = require("../middleware/auth"); // Importe o authorize

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Rota para usuário atual (qualquer usuário autenticado)
router
  .route("/me")
  .put(protect, updateUser)
  .delete(protect, (req, res) => {
    // Rota mantida para auto-exclusão
    res.status(403).json({
      success: false,
      message: "Use a rota /api/auth/:id (apenas para administradores)",
    });
  });

// Nova rota para admin deletar usuários
router.delete("/:id", protect, authorize("admin"), deleteUser);

router.get('/users', protect, authorize('admin'), getUsers);

module.exports = router;

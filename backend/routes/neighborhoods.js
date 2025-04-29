const express = require("express");
const {
  createNeighborhood,
  getNeighborhoodsByCity,
  updateNeighborhood,
  deleteNeighborhood,
  getNeighborhoods,
} = require("../controllers/neighborhoods");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Rota para listar bairros por cidade
router.get("/cities/:cityId/neighborhoods", getNeighborhoodsByCity);

// Rotas públicas
router.get("/", getNeighborhoods);

// Rotas protegidas (admin)
router.post("/", protect, authorize("admin"), createNeighborhood);

router.put("/:id", protect, authorize("admin"), updateNeighborhood);

router.delete("/:id", protect, authorize("admin"), deleteNeighborhood);

module.exports = router;

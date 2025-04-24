require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const { protect, authorize } = require("./middleware/auth");

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/cities", require("./routes/cities"));
app.use("/api/neighborhoods", require("./routes/neighborhoods"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/subcategories", require("./routes/subcategories"));
app.use("/api/businesses", require("./routes/businesses"));
app.use("/api/favorites", require("./routes/favorites"));

// Conexão com MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Rota básica de teste
app.get("/", (req, res) => {
  res.send("API de Negócios Locais está funcionando!!!");
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

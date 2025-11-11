require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const sitemapRoutes = require("./routes/sitemap");

const app = express();

const { protect, authorize } = require("./middleware/auth");

// -------------------------
// ✅ Configuração CORS segura
// -------------------------
const allowedOrigins = [
  "https://app-negocios-locais.vercel.app",
  "https://www.ovaleonline.com.br",
  "https://ovaleonline.com.br",
  "http://localhost:3000", // opcional para ambiente local
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite requisições internas e do Postman (sem header origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Permite o Express interpretar JSON
app.use(express.json());

// -------------------------
// Redirecionamento temporário
// -------------------------
app.get("/helio-flores-uniateneu", (req, res) => {
  res.redirect(301, "/helio-parceiro-uniateneu");
});

// -------------------------
// Servir arquivos estáticos
// -------------------------
app.use(express.static(path.join(__dirname, "public")));

// -------------------------
// Tratamento global de erros
// -------------------------
app.use((err, req, res, next) => {
  // Erros de duplicidade no MongoDB
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `Já existe um registro com este ${field}`,
      field: field,
    });
  }

  // Erros de CORS (tratamento elegante)
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Requisição bloqueada por política de CORS.",
    });
  }

  // Outros erros gerais
  console.error("Erro no servidor:", err);
  res.status(500).json({
    success: false,
    message: "Erro no servidor",
  });
});

// -------------------------
// Rotas principais
// -------------------------
app.use("/", sitemapRoutes);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/cities", require("./routes/cities"));
app.use("/api/neighborhoods", require("./routes/neighborhoods"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/subCategories", require("./routes/subCategories"));
app.use("/api/favorites", require("./routes/favorites"));
app.use("/api/businesses", require("./routes/businesses"));

// -------------------------
// Conexão com MongoDB
// -------------------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// -------------------------
// Rota básica de teste
// -------------------------
app.get("/", (req, res) => {
  res.send("🚀 API de Negócios Locais está funcionando!!!");
});

// -------------------------
// Inicialização do servidor
// -------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});

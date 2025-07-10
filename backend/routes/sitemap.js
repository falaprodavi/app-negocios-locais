// routes/sitemap.js
const express = require("express");
const router = express.Router();
const Business = require("../models/Business");

router.get("/sitemap.xml", async (req, res) => {
  try {
    const businesses = await Business.find().select("slug updatedAt"); // opcional: filtro por ativos

    const baseUrl = "https://www.ovaleonline.com.br";

    const urls = businesses
      .map((b) => {
        const lastmod = b.updatedAt
          ? b.updatedAt.toISOString()
          : new Date().toISOString();

        return `
      <url>
        <loc>${baseUrl}/${b.slug}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`;
      })
      .join("");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (err) {
    console.error("Erro ao gerar sitemap:", err);
    res.status(500).send("Erro ao gerar sitemap");
  }
});

module.exports = router;

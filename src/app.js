const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const app = express();
app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
app.use("/auth", require("./modules/auth/auth.routes"));
app.use("/restaurants", require("./modules/restaurants/restaurant.routes"));
app.use(require("./modules/dishes/dish.routes"));
app.use((req, res) => res.status(404).json({ error: "Rota não encontrada" }));
app.use((error, req, res, next) => {
 if (error instanceof multer.MulterError) {
  if (error.code === "LIMIT_FILE_SIZE") return res.status(413).json({ error: "Imagem maior que o limite de 5 MB" });
  return res.status(400).json({ error: error.message });
 }
 const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
 if (status === 500) console.error("[ERRO]", error);
 return res.status(status).json({ error: status === 500 ? "Erro interno do servidor" : error.message });
});
module.exports = app;

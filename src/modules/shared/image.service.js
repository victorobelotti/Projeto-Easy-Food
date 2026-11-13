const sharp = require("sharp");
const path = require("path");
const fs = require("fs/promises");
const crypto = require("crypto");
const ALLOWED_FOLDERS = new Set(["dishes", "users"]);
async function optimizeImage(buffer, folder = "dishes") {
 if (!Buffer.isBuffer(buffer) || buffer.length === 0) { const e = new Error("Imagem vazia ou inválida"); e.statusCode = 400; throw e; }
 if (!ALLOWED_FOLDERS.has(folder)) { const e = new Error("Destino de imagem inválido"); e.statusCode = 400; throw e; }
 const filename = `${crypto.randomUUID()}.webp`;
 const directory = path.resolve(process.cwd(), "uploads", folder);
 await fs.mkdir(directory, { recursive: true });
 await sharp(buffer, { limitInputPixels: 40_000_000 }).rotate().resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(directory, filename));
 return `/uploads/${folder}/${filename}`;
}
async function deleteImage(imageUrl) {
 if (typeof imageUrl !== "string") return;
 const match = /^\/uploads\/(dishes|users)\/([a-f0-9-]+)\.webp$/i.exec(imageUrl);
 if (!match) return;
 const filepath = path.resolve(process.cwd(), "uploads", match[1], `${match[2]}.webp`);
 await fs.unlink(filepath).catch(() => {});
}
module.exports = { optimizeImage, deleteImage };

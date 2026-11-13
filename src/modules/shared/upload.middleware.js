const multer = require("multer");
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
module.exports = multer({
 storage: multer.memoryStorage(),
 limits: { fileSize: MAX_FILE_SIZE, files: 1 },
 fileFilter(req, file, callback) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) { const error = new Error("Formato de imagem não permitido. Envie JPEG, PNG ou WebP."); error.statusCode = 400; return callback(error); }
  return callback(null, true);
 }
});

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../../database/prisma");
const imageService = require("../shared/image.service");
function jwtSecret() {
 const secret = process.env.JWT_SECRET;
 if (!secret || secret.length < 32 || secret.includes("SUBSTITUA_")) throw new Error("JWT_SECRET deve ser configurado no .env com pelo menos 32 caracteres.");
 return secret;
}
function publicUser(user) { return { id: user.id, name: user.name, email: user.email, imageUrl: user.imageUrl || null }; }
function parseUserId(value) { const id = Number(value); if (!Number.isSafeInteger(id) || id <= 0) { const e = new Error("Usuário inválido"); e.statusCode = 400; throw e; } return id; }
async function register({ name, email, password }) {
 const normalizedEmail = String(email || "").trim().toLowerCase();
 if (typeof name !== "string" || !name.trim() || name.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || typeof password !== "string" || password.length < 8) { const e = new Error("Informe nome, e-mail válido e senha com ao menos 8 caracteres."); e.statusCode = 400; throw e; }
 const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
 if (existing) { const e = new Error("E-mail já cadastrado"); e.statusCode = 409; throw e; }
 const hashedPassword = await bcrypt.hash(password, 10);
 const user = await prisma.user.create({ data: { name: name.trim(), email: normalizedEmail, password: hashedPassword } });
 return publicUser(user);
}
async function login({ email, password }) {
 const normalizedEmail = String(email || "").trim().toLowerCase();
 const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
 if (!user || typeof password !== "string" || !(await bcrypt.compare(password, user.password))) { const e = new Error("Credenciais inválidas"); e.statusCode = 401; throw e; }
 const token = jwt.sign({ sub: user.id, email: user.email }, jwtSecret(), { expiresIn: "1d" });
 return { token, user: publicUser(user) };
}
async function getById(userId) { const user = await prisma.user.findUnique({ where: { id: parseUserId(userId) } }); return user ? publicUser(user) : null; }
async function uploadProfileImage(userId, buffer) {
 const id = parseUserId(userId);
 const user = await prisma.user.findUnique({ where: { id } });
 if (!user) { const e = new Error("Usuário não encontrado"); e.statusCode = 404; throw e; }
 const imageUrl = await imageService.optimizeImage(buffer, "users");
 try {
  const updated = await prisma.user.update({ where: { id }, data: { imageUrl } });
  if (user.imageUrl && user.imageUrl !== imageUrl) await imageService.deleteImage(user.imageUrl);
  return publicUser(updated);
 } catch (error) { await imageService.deleteImage(imageUrl); throw error; }
}
module.exports = { register, login, getById, uploadProfileImage, jwtSecret };

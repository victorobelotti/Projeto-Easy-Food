const prisma = require("../../database/prisma");
const emailService = require("../shared/email.service");
function cleanRating(value) {
 if (value === undefined || value === null || value === "") return 0;
 const n = Number(value); if (!Number.isFinite(n) || n < 0 || n > 5) { const e = new Error("Avaliação deve estar entre 0 e 5"); e.statusCode = 400; throw e; }
 return Math.round(n * 10) / 10;
}
function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]); }
async function listRestaurants() { return prisma.restaurant.findMany({ orderBy: { id: "asc" } }); }
async function createRestaurant(data, user) {
 if (!user || !user.id) { const e = new Error("Usuário não autenticado"); e.statusCode = 401; throw e; }
 if (typeof data.name !== "string" || !data.name.trim() || data.name.length > 150 || typeof data.category !== "string" || !data.category.trim() || data.category.length > 100) { const e = new Error("Nome e categoria são obrigatórios (máximo 150 e 100 caracteres)."); e.statusCode = 400; throw e; }
 const restaurant = await prisma.restaurant.create({ data: { name: data.name.trim(), category: data.category.trim(), rating: cleanRating(data.rating), ownerId: Number(user.id) } });
 const notifications = [
  { to: process.env.EMAIL_TO || user.email, subject: `Bem-vindo à EasyFood, ${restaurant.name}!`, header: `Olá, ${restaurant.name}!`, body: `Seu restaurante foi cadastrado com sucesso na EasyFood.<br/>Categoria: ${escapeHtml(restaurant.category)}.` },
  { to: process.env.EMAIL_COMMERCIAL_TO, subject: `Novo restaurante cadastrado: ${restaurant.name}`, header: "Novo restaurante na plataforma", body: `Nome: ${escapeHtml(restaurant.name)}<br/>Categoria: ${escapeHtml(restaurant.category)}<br/>Avaliação: ${restaurant.rating}` }
 ];
 for (const item of notifications) { try { await emailService.sendEmail({ ...item, toName: restaurant.name, footer: "Equipe EasyFood" }); } catch (error) { console.error("Erro ao enviar e-mail:", error.message); } }
 return restaurant;
}
module.exports = { listRestaurants, createRestaurant, cleanRating };

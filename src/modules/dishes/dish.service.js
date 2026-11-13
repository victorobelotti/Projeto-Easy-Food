const prisma = require("../../database/prisma");
const imageService = require("../shared/image.service");
function parseId(value, label = "Identificador") { const id = Number(value); if (!Number.isSafeInteger(id) || id <= 0) { const e = new Error(`${label} inválido`); e.statusCode = 400; throw e; } return id; }
function validateDish(data) {
 if (!data || typeof data.name !== "string" || !data.name.trim() || data.name.trim().length > 150) { const e = new Error("Nome é obrigatório (máximo 150 caracteres)"); e.statusCode = 400; throw e; }
 // A versão atual do repositório do professor exige categoria no cadastro.
 if (typeof data.category !== "string" || !data.category.trim()) { const e = new Error("Categoria é obrigatória"); e.statusCode = 400; throw e; }
 if (typeof data.description !== "string") { const e = new Error("Descrição inválida"); e.statusCode = 400; throw e; }
 const price = Number(data.price);
 if (data.price === null || data.price === undefined || data.price === "" || !Number.isFinite(price) || price < 0 || price > 99999999.99) { const e = new Error("Preço inválido"); e.statusCode = 400; throw e; }
 return { name: data.name.trim(), category: data.category.trim(), description: data.description.trim(), price: price.toFixed(2) };
}
function ensureOwnership(restaurant, userId) { if (!restaurant.ownerId || Number(restaurant.ownerId) !== Number(userId)) { const e = new Error("Você não tem permissão para gerenciar este restaurante"); e.statusCode = 403; throw e; } }
async function getDishWithRestaurant(dishId) {
 const dish = await prisma.dish.findUnique({ where: { id: parseId(dishId, "Prato") }, include: { restaurant: true } });
 if (!dish) { const e = new Error("Prato não encontrado"); e.statusCode = 404; throw e; }
 return dish;
}
async function createDish(restaurantId, data, userId) {
 const id = parseId(restaurantId, "Restaurante"); const ownerId = parseId(userId, "Usuário"); const validated = validateDish(data);
 const restaurant = await prisma.restaurant.findUnique({ where: { id } });
 if (!restaurant) { const e = new Error("Restaurante não encontrado"); e.statusCode = 404; throw e; }
 ensureOwnership(restaurant, ownerId);
 return prisma.dish.create({ data: { ...validated, restaurantId: id } });
}
async function listDishes(restaurantId) { return prisma.dish.findMany({ where: { restaurantId: parseId(restaurantId, "Restaurante") }, orderBy: { id: "asc" } }); }
async function getDish(dishId) {
 const dish = await prisma.dish.findUnique({ where: { id: parseId(dishId, "Prato") } });
 if (!dish) { const e = new Error("Prato não encontrado"); e.statusCode = 404; throw e; }
 return dish;
}
async function uploadDishImage(dishId, buffer, userId) {
 const dish = await getDishWithRestaurant(dishId); ensureOwnership(dish.restaurant, parseId(userId, "Usuário"));
 const imageUrl = await imageService.optimizeImage(buffer, "dishes");
 try {
  const updated = await prisma.dish.update({ where: { id: dish.id }, data: { imageUrl } });
  if (dish.imageUrl && dish.imageUrl !== imageUrl) await imageService.deleteImage(dish.imageUrl);
  return updated;
 } catch (error) { await imageService.deleteImage(imageUrl); throw error; }
}
async function updateDish(dishId, data, userId) { const dish = await getDishWithRestaurant(dishId); ensureOwnership(dish.restaurant, parseId(userId, "Usuário")); return prisma.dish.update({ where: { id: dish.id }, data: validateDish(data) }); }
async function deleteDish(dishId, userId) { const dish = await getDishWithRestaurant(dishId); ensureOwnership(dish.restaurant, parseId(userId, "Usuário")); await prisma.dish.delete({ where: { id: dish.id } }); if (dish.imageUrl) await imageService.deleteImage(dish.imageUrl); }
module.exports = { createDish, listDishes, getDish, uploadDishImage, updateDish, deleteDish, validateDish, parseId };

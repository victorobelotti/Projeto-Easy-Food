const dishService = require("./dish.service");
async function create(req, res, next) { try { return res.status(201).json(await dishService.createDish(req.params.restaurantId, req.body || {}, req.user.id)); } catch (e) { return next(e); } }
async function list(req, res, next) { try { return res.json(await dishService.listDishes(req.params.restaurantId)); } catch (e) { return next(e); } }
async function getById(req, res, next) { try { return res.json(await dishService.getDish(req.params.dishId)); } catch (e) { return next(e); } }
async function uploadImage(req, res, next) {
 try {
  if (!req.file) { const e = new Error("Nenhuma imagem enviada"); e.statusCode = 400; throw e; }
  const dish = await dishService.uploadDishImage(req.params.dishId, req.file.buffer, req.user.id);
  return res.status(200).json(dish);
 } catch (e) { return next(e); }
}
async function update(req, res, next) { try { return res.json(await dishService.updateDish(req.params.dishId, req.body || {}, req.user.id)); } catch (e) { return next(e); } }
async function remove(req, res, next) { try { await dishService.deleteDish(req.params.dishId, req.user.id); return res.status(204).send(); } catch (e) { return next(e); } }
module.exports = { create, list, getById, uploadImage, update, remove };

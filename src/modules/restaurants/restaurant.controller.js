const service = require("./restaurant.service");
async function list(req, res, next) { try { return res.json(await service.listRestaurants()); } catch (e) { return next(e); } }
async function create(req, res, next) { try { return res.status(201).json(await service.createRestaurant(req.body || {}, req.user)); } catch (e) { return next(e); } }
module.exports = { list, create };

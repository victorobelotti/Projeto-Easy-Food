const authService = require("./auth.service");
async function register(req, res, next) { try { return res.status(201).json(await authService.register(req.body || {})); } catch (e) { return next(e); } }
async function login(req, res, next) { try { return res.json(await authService.login(req.body || {})); } catch (e) { return next(e); } }
async function me(req, res, next) { try { const user = await authService.getById(req.user.id); if (!user) return res.status(404).json({ error: "Usuário não encontrado" }); return res.json(user); } catch (e) { return next(e); } }
async function uploadProfileImage(req, res, next) {
 try {
  if (!req.file) { const e = new Error("Nenhuma imagem enviada"); e.statusCode = 400; throw e; }
  const user = await authService.uploadProfileImage(req.user.id, req.file.buffer);
  return res.status(200).json(user);
 } catch (e) { return next(e); }
}
module.exports = { register, login, me, uploadProfileImage };

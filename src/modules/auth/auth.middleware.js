const jwt = require('jsonwebtoken');
const {jwtSecret}=require('./auth.service');
module.exports=function authenticate(req,res,next) {
  const match=/^Bearer\s+(.+)$/i.exec(req.headers.authorization || '');
  if (!match) return res.status(401).json({error:'Token não informado'});
  try {
    const payload=jwt.verify(match[1],jwtSecret());
    req.user={id:Number(payload.sub),email:payload.email};
    next();
  } catch (_) {return res.status(401).json({error:'Token inválido ou expirado'});}
};

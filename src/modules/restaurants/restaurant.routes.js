const router=require('express').Router();
const controller=require('./restaurant.controller');
const authenticate=require('../auth/auth.middleware');
router.get('/',controller.list);
router.post('/',authenticate,controller.create);
module.exports=router;

const router = require("express").Router();
const controller = require("./auth.controller");
const authenticate = require("./auth.middleware");
const upload = require("../shared/upload.middleware");
router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/me", authenticate, controller.me);
router.post("/me/image", authenticate, upload.single("image"), controller.uploadProfileImage);
module.exports = router;

// req router
const router = require("express").Router();
// req middlewares
const { authMiddleware } = require("../middleWares/authMiddleWare");
// req controllers
const authController = require("../controller/authController");

// routes
// Register Route
router.post("/register", authController.register);
// Login Route
router.post("/login", authController.login);
// Get Me Route
router.get("/me", authMiddleware, authController.getMe);

//export router
module.exports = router


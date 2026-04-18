// req router
const router = require("express").Router();
// req controllers
const serviceController = require("../controller/serviceController.js");
// req middlewares
const { authMiddleware } = require("../middleWares/authMiddleWare");
const { allowTo } = require("../middleWares/roleMiddleWare");

// routes
router.use(authMiddleware);
router.use(allowTo("admin"));
// Create Service Route
router.post("/", serviceController.createNewService);
// Get Services Route
router.get("/", serviceController.findAllServices);
// Get Service Route
router.get("/:id", serviceController.findServiceById);
// Update Service Route
router.put("/:id", serviceController.updateServiceById);
// Delete Service Route
router.delete("/:id", serviceController.deleteServiceById);

//export router
module.exports = router


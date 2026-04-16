// req router
const router = require("express").Router();
// req controllers
const roomTypeController = require("../controller/roomTypeController.js");

// routes
// Create Room Type Route
router.post("/", roomTypeController.createNewRoomType);
// Get Room Types Route
router.get("/", roomTypeController.findAllRoomTypes);
// Get Room Type Route
router.get("/:id", roomTypeController.findRoomTypeById);
// Update Room Type Route
router.put("/:id", roomTypeController.updateRoomTypeById);
// Delete Room Type Route
router.delete("/:id", roomTypeController.deleteRoomTypeById);

//export router
module.exports = router


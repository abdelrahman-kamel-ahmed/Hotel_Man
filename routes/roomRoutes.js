// req router
const router = require("express").Router();
// req controllers
const roomController = require("../controller/roomController.js");

// routes
// Create Room Route
router.post("/", roomController.createRoom);
// Get Rooms Route
router.get("/", roomController.findAllRooms);
// Get Room Route
router.get("/:id", roomController.findRoomById);
// Update Room Route
router.put("/:id", roomController.updateRoomById);
// Delete Room Route
router.delete("/:id", roomController.deleteRoomById);

//export router
module.exports = router


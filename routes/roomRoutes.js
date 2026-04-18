// req router
const router = require("express").Router();
// req controllers
const roomController = require("../controller/roomController.js");
// req middlewares
const { allowTo } = require("../middleWares/roleMiddleWare");
const { authMiddleware } = require("../middleWares/authMiddleWare");


// routes
router.use(authMiddleware);
// Create Room Route
router.post("/", allowTo("admin"),roomController.createNewRoom);
// Get Rooms Route
router.get("/", allowTo("admin", "receptionist"), roomController.findAllRooms);
// Get Room Route
router.get("/:id", allowTo("admin", "receptionist"), roomController.findRoomById);
// Update Room Route
router.put("/:id", allowTo("admin", "receptionist"), roomController.updateRoomById);
// Delete Room Route
router.delete("/:id", allowTo("admin"), roomController.deleteRoomById);

//export router
module.exports = router


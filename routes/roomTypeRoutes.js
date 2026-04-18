const router = require("express").Router();

// req controllers
const roomTypeController = require("../controller/roomTypeController.js");

// req middlewares
const { authMiddleware } = require("../middlewares/authMiddleware");
const { allowTo } = require("../middlewares/roleMiddleware");


//protect all routes below
router.use(authMiddleware);
router.use(allowTo("admin"));


// routes
router.post("/", roomTypeController.createNewRoomType);

router.get("/", roomTypeController.findAllRoomTypes);

router.get("/:id", roomTypeController.findRoomTypeById);

router.put("/:id", roomTypeController.updateRoomTypeById);

router.delete("/:id", roomTypeController.deleteRoomTypeById);


// export router
module.exports = router;
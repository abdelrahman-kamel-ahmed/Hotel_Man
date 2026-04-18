// req router
const router = require("express").Router();
// req controllers
const guestController = require("../controller/guestController.js");
// req middlewares
const { allowTo } = require("../middleWares/roleMiddleWare");
const { authMiddleware } = require("../middleWares/authMiddleWare");

// routes
router.use(authMiddleware);

//find all guests
router.get("/", allowTo("admin", "receptionist"), guestController.findAllGuests);

//find guest by id
router.get("/:id", allowTo("admin", "receptionist"), guestController.findGuestById);

//add new guest
router.post("/", allowTo("admin", "receptionist"), guestController.createNewGuest);

//update guest by id
router.put("/:id", allowTo("admin", "receptionist"), guestController.updateGuestById);

//delete guest by id
router.delete("/:id", allowTo("admin", "receptionist"), guestController.deleteGuestById);


//export router
module.exports = router


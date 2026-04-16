// req router
const router = require("express").Router();
// req controllers
const guestController = require("../controller/guestController.js");

// routes

//find all guests
router.get("/", guestController.findAllGuests);

//find guest by id
router.get("/:id", guestController.findGuestById);

//add new guest
router.post("/", guestController.addNewGuest);

//update guest by id
router.put("/:id", guestController.updateGuestById);

//delete guest by id
router.delete("/:id", guestController.deleteGuestById);


//export router
module.exports = router


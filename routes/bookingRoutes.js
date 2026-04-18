// req router
const router = require("express").Router();
// req controllers
const bookingController = require("../controller/bookingController.js");

// routes

//find all bookings
router.get("/", bookingController.findAllBookings);

//find booking by id
router.get("/:id", bookingController.findBookingById);

//add new booking
router.post("/", bookingController.createNewBooking);

//update booking by id
router.patch("/:id", bookingController.updateBookingById);

//delete booking by id
router.delete("/:id", bookingController.deleteBookingById);


//export router
module.exports = router


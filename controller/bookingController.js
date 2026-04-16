//req model
const { where , Op} = require("sequelize");
const { Booking, Guest, Room, Service, RoomType, BookingService } = require("../models");
//req validation schemas
const { createBookingSchema, updateBookingSchema } = require("../validation/bookingValidation");

exports.createBooking = async function (request, response) {
    try {
        //validate request body
        const { error, value } = createBookingSchema.validate(request.body ,{ abortEarly: false });
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }
        //create booking
        const { guestId, roomId, checkInDate, checkOutDate, services } = value;
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        //check if guest exists
        const guest = await Guest.findByPk(guestId);
        if (!guest) {
            return response.status(404).json({ message: "Guest Not Found!" });
        }
        //check if room exists
        const room = await Room.findByPk(roomId,{include: RoomType});
        if (!room) {
            return response.status(404).json({ message: "Room Not Found!" });
        }
        // check if the room is available for the given dates
        if(room.status!=="available"){
            return response.status(400).json({ message: "Room is not available!" });
        }
        if (checkOut <= checkIn) {
            return response.status(400).json({ message: "Invalid booking dates!" });
        }
        //check if the room isn't booked already 
        const existingBooking = await Booking.findOne(
            {where : {
                roomId: roomId,
                //if there is a booking and its status is not cancelled or checked oot this means that the room is now busy 
                status:{[Op.notIn]:["cancelled", "checkedOut"]},
                [Op.and]: [
                //check if there is a booking that overlaps with the given dates

                { checkInDate: { [Op.lte]: checkOut } },
                { checkOutDate: { [Op.gte]: checkIn } },
                ],
            }
        });
        if (existingBooking) {
            return response.status(409).json({ message: "Room is already booked for the given dates!" });
        }
        // no of nights
        const noOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        //check if the no of nightis is less than 1
        if (noOfNights < 1) {
            return response.status(400).json({ message: "Invalid booking dates!" });
        }
        //calculate total price for the room 
        //price per night * no of nights
        const roomPricePerNight = room.RoomType? room.RoomType.pricePerNight : 0;
        let totalPrice = roomPricePerNight * noOfNights;

        
        //create booking
        const newBooking = await Booking.create( {
            roomId,
            guestId,
            checkInDate,
            checkOutDate,
            totalPrice,
            status:"Pending"
        });
        //add services to the booking
        if (services && services.length > 0) {
            const bookedServices = services.map((service)=>({
            //if there are services we will take the id and quantity for each
            //bec we said in the booking validator that the services will be an array of objects each object has serviceId and quantity
            ...service,
            //add the booking id to be put at the booking services table
            bookingId: newBooking.id,
        }))
        //bulk create the booking services that the guest took
        await BookingService.bulkCreate(bookedServices);
        //get the total price for the services
        const orderedServices = await Service.findAll({
            where: {
                id: services.map((service) => service.serviceId),
            },
        });
        //calculate the total price for the services
        const serviceTotalPrice = orderedServices.reduce((total, service) => {
            const qty= bookedServices.find((s) => s.serviceId === service.id)?.quantity || 1;
            return total + (service.price*qty);
        }, 0);
        //update the total price for the booking
        totalPrice+=serviceTotalPrice;
        await newBooking.update({ totalPrice });
        await room.update({ status: "occupied" });
        }
        //handle response
        response.status(201).json({ message: "Booking Created", booking: newBooking });
    } catch (error) {
        console.log(error);
        response.status(500).json({ message: "Internal Server Error!" });
    }
};

/**
     // Import Sequelize operators
    const { Op } = require("sequelize");

    // Import models
    const {
    Booking,
    Guest,
    Room,
    Service,
    RoomType,
    BookingService
    } = require("../models");

    // Import validation schema
    const {
    createBookingSchema,
    updateBookingSchema
    } = require("../validation/bookingValidation");

    exports.createBooking = async function (request, response) {
    try {

        // =========================
        // 1. VALIDATE REQUEST BODY
        // =========================
        const { error, value } = createBookingSchema.validate(request.body, {
        abortEarly: false
        });

        if (error) {
        return response.status(400).json({
            message: error.details[0].message
        });
        }

        // =========================
        // 2. EXTRACT DATA
        // =========================
        const { guestId, roomId, checkInDate, checkOutDate, services } = value;

        // Convert dates to proper Date objects
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        // =========================
        // 3. VALIDATE GUEST
        // =========================
        const guest = await Guest.findByPk(guestId);

        if (!guest) {
        return response.status(404).json({
            message: "Guest Not Found!"
        });
        }

        // =========================
        // 4. VALIDATE ROOM
        // =========================
        const room = await Room.findByPk(roomId, {
        include: RoomType
        });

        if (!room) {
        return response.status(404).json({
            message: "Room Not Found!"
        });
        }

        // Check room availability status
        if (room.status !== "available") {
        return response.status(400).json({
            message: "Room is not available!"
        });
        }

        // Validate date logic
        if (checkOut <= checkIn) {
        return response.status(400).json({
            message: "Invalid booking dates!"
        });
        }

        // =========================
        // 5. CHECK ROOM AVAILABILITY (OVERLAP LOGIC)
        // =========================
        const existingBooking = await Booking.findOne({
        where: {
            roomId,

            // Ignore cancelled and completed bookings
            status: {
            [Op.notIn]: ["cancelled", "checkedOut"]
            },

            // Overlapping date condition:
            // existing.checkInDate <= new.checkOut
            // AND existing.checkOutDate >= new.checkIn
            [Op.and]: [
            { checkInDate: { [Op.lte]: checkOut } },
            { checkOutDate: { [Op.gte]: checkIn } }
            ]
        }
        });

        if (existingBooking) {
        return response.status(409).json({
            message: "Room is already booked for the given dates!"
        });
        }

        // =========================
        // 6. CALCULATE NUMBER OF NIGHTS
        // =========================
        const noOfNights = Math.ceil(
        (checkOut - checkIn) / (1000 * 60 * 60 * 24)
        );

        if (noOfNights < 1) {
        return response.status(400).json({
            message: "Invalid booking dates!"
        });
        }

        // =========================
        // 7. CALCULATE ROOM PRICE
        // =========================
        const roomPricePerNight = room.RoomType
        ? room.RoomType.pricePerNight
        : 0;

        // totalPrice must be let because it will be updated later
        let totalPrice = roomPricePerNight * noOfNights;

        // =========================
        // 8. CREATE BOOKING
        // =========================
        const newBooking = await Booking.create({
        roomId,
        guestId,
        checkInDate,
        checkOutDate,
        totalPrice,
        status: "Pending"
        });

        // =========================
        // 9. HANDLE SERVICES (IF ANY)
        // =========================
        if (services && services.length > 0) {

        // Prepare booking-services pivot data
        const bookedServices = services.map((service) => ({
            ...service,
            bookingId: newBooking.id
        }));

        // Insert into BookingService table
        await BookingService.bulkCreate(bookedServices);

        // Get service details from DB
        const orderedServices = await Service.findAll({
            where: {
            id: services.map((s) => s.serviceId)
            }
        });

        // Calculate services total price
        const serviceTotalPrice = orderedServices.reduce(
            (total, service) => {

            const qty =
                bookedServices.find(
                (s) => s.serviceId === service.id
                )?.quantity || 1;

            return total + service.price * qty;
            },
            0
        );

        // Add services cost to booking total
        totalPrice += serviceTotalPrice;

        // Update booking with final price
        await newBooking.update({ totalPrice });

        // Mark room as occupied
        await room.update({ status: "occupied" });
        }

        // =========================
        // 10. RESPONSE
        // =========================
        return response.status(201).json({
        message: "Booking Created",
        booking: newBooking
        });

    } catch (error) {
        console.log(error);

        return response.status(500).json({
        message: "Internal Server Error!"
        });
    }
    };
 */
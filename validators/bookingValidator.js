//req joi validator
const Joi = require("joi");

//createBooking Schema
exports.createBookingSchema = Joi.object({
    checkedin: Joi.date().iso().required(),
    checkedout: Joi.date().iso().min(Joi.ref('checkedin')).required(),
    guestId: Joi.string().uuid().required(),
    roomId: Joi.string().uuid().required(),
    services: Joi.array().items(Joi.object({
        serviceId: Joi.string().uuid().required(),
        quantity: Joi.number().integer().min(1).default(1),
    })).optional().default([]),
});

//updateBooking Schema
exports.updateBookingSchema = Joi.object({
    status: Joi.string().valid("pending", "confirmed", "checked-in", "checked-out", "cancelled").required(),
});
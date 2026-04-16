//req joi validator
const Joi = require("joi");

//createRoom Schema
exports.createRoomSchema = Joi.object({
    roomNumber: Joi.string().trim().min(1).max(10).required(),
    floor: Joi.number().integer().positive().min(0).required(),
    roomTypeId: Joi.string().uuid().required(),
    status: Joi.string().valid('available', 'occupied', 'maintenance').default('available'),
});

// updateRoom Schema
exports.updateRoomSchema = Joi.object({
    roomNumber: Joi.string().trim().min(1).max(10).optional(),
    floor: Joi.number().integer().positive().optional(),
    roomTypeId: Joi.string().uuid().optional(),
    status: Joi.string().valid('available', 'occupied', 'maintenance').optional(),
});
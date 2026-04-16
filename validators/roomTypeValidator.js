//req joi validator
const Joi = require("joi");

//createRoomType Schema
exports.createRoomTypeSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    capacity: Joi.number().integer().min(1).positive().required(),
});

//updateRoomType Schema
exports.updateRoomTypeSchema = Joi.object({
    name: Joi.string().optional(),
    price: Joi.number().positive().optional(),
    capacity: Joi.number().integer().min(1).positive().optional(),
});
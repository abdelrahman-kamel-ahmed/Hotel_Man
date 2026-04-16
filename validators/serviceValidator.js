//req joi validator
const Joi = require("joi");

//createService Schema
exports.createServiceSchema = Joi.object({
    name: Joi.string().trim().min(3).max(15).required(),
    price: Joi.number().positive().required(),
    description: Joi.string().min(3).max(100).optional(),
    
});

// updateService Schema
exports.updateServiceSchema = Joi.object({
    name: Joi.string().trim().min(3).max(15).optional(),
    price: Joi.number().positive().optional(),
    description: Joi.string().min(3).max(100).optional(),
});
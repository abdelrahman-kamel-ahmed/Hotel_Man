const joi=require("joi");
//create guest schema
exports.createGuestSchema=joi.object({
    firstName:joi.string().trim().required(),
    lastName:joi.string().trim().required(),
    email:joi.string().email().required(),
    phone:joi.string().trim().required(),
    nationalId:joi.string().trim().required(),
});
//update guest schema
exports.updateGuestSchema=joi.object({
    firstName:joi.string().trim().optional(),
    lastName:joi.string().trim().optional(),
    phone:joi.string().trim().optional(),
});
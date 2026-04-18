const joi=require("joi");
//create guest schema
exports.createGuestSchema=joi.object({
    Firstname:joi.string().trim().required(),
    Lastname:joi.string().trim().required(),
    email:joi.string().email().required(),
    phone:joi.string().trim().required(),
    nationalId:joi.string().trim().required(),
});
//update guest schema
exports.updateGuestSchema=joi.object({
    Firstname:joi.string().trim().optional(),
    Lastname:joi.string().trim().optional(),
    phone:joi.string().trim().optional(),
});
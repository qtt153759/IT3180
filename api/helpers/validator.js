const Joi=require('joi');
const userValidator=(data)=>{
    const userSchema=Joi.object({
        email: Joi.string().lowercase().email().required(),
        password: Joi.string().min(4).max(32).required()
    });
    return userSchema.validate(data)
}
const demographicsValidator=(data)=>{
    const demographicsSchema=Joi.object({
        firstname: Joi.string().min(1).max(100).required(),
        lastname: Joi.string().min(1).max(100).required(),
    }).unknown(true);
    return demographicsSchema.validate(data)
}
module.exports={
    userValidator:userValidator,
    demographicsValidator:demographicsValidator
}
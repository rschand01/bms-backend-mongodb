import Joi from "joi";

export const emailValidator = Joi.object({
  email: Joi.string().email().required(),
}).unknown(true);

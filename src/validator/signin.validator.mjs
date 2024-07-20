import Joi from "joi";

export const signInValidator = Joi.object({
  userName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().required(),
})
  .or("userName", "email")
  .unknown(true);

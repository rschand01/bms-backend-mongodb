import Joi from "joi";

export const userSocialValidator = Joi.object({
  email: Joi.string().email().required(),
  userId: Joi.string().required(),
  userData: Joi.object().required(),
}).unknown();

import Joi from "joi";

export const payloadValidator = Joi.object({
  userData: Joi.object().required(),
}).unknown();

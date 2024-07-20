import Joi from "joi";

export const tokenValidator = Joi.object({
  token: Joi.string().required(),
});

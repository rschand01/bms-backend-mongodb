import Joi from "joi";

export const csrfValidator = Joi.object({
  _csrf: Joi.string().required(),
});

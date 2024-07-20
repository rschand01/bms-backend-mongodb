import Joi from "joi";

export const userProfileUpdateValidator = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(20)
    .pattern(new RegExp("^[A-Z][a-z]{1,19}$")),

  lastName: Joi.string()
    .min(2)
    .max(20)
    .pattern(new RegExp("^[A-Z][a-z]{1,19}$")),

  userName: Joi.string().min(3).max(20).pattern(new RegExp("^[a-z]{3,20}$")),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .max(300),

  age: Joi.number().min(1),
  profileImage: Joi.string(),
  phoneContact: Joi.string()
    .min(7)
    .max(20)
    .pattern(new RegExp("^\\+\\(\\d{3}\\) \\d{3} \\d{4}$")),

  country: Joi.string().min(2).max(20),
}).unknown(true);

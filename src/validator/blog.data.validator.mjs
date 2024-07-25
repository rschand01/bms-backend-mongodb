import Joi from "joi";

export const blogDataValidator = Joi.object({
  blogTitle: Joi.string()
    .min(2)
    .max(200)
    .pattern(new RegExp("^[A-Z][a-z]*( [A-Z][a-z]*)*$"))
    .required(),

  blogContent: Joi.string()
    .min(3)
    .max(50000)
    .pattern(new RegExp("^[A-Z][a-z]*( [A-z][a-z]*)*$"))
    .required(),

  blogAuthor: Joi.string()
    .min(2)
    .max(100)
    .pattern(new RegExp("^[A-Z][a-z]*( [A-Z][a-z]*)*$"))
    .required(),

  blogImage: Joi.string(),
}).unknown(true);

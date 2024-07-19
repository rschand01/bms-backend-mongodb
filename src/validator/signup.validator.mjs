import Joi from "joi";

export const signUpValidator = Joi.object({
  _csrf: Joi.string().required(),

  firstName: Joi.string()
    .min(2)
    .max(20)
    .pattern(new RegExp("^[A-Z][a-z]{1,19}$"))
    .required(),

  lastName: Joi.string()
    .min(2)
    .max(20)
    .pattern(new RegExp("^[A-Z][a-z]{1,19}$"))
    .required(),

  userName: Joi.string()
    .min(3)
    .max(20)
    .pattern(new RegExp("^[a-z]{3,20}$"))
    .required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .max(300)
    .required(),

  password: Joi.string()
    .min(8)
    .max(100)
    .pattern(
      new RegExp(
        "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%^&*])(?!.*(.)\\1\\1)(?!.*(?:0123|1234|2345|3456|4567|5678|6789|7890|8901|9012|abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz|WXYZ|XYZA|YZAB|ZABC|@#$%|#$%^|%^&*|&*!@))[a-zA-Z\\d!@#$%^&*]{8,100}$"
      )
    )
    .required(),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

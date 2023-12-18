const Joi = require("joi");

const SMTPTesterRequestSchema = Joi.object({
  host: Joi.string().required(),
  port: Joi.number().integer().min(1).max(65535).required(),
  secure: Joi.string().valid("auto", "none").optional(),
  from: Joi.string().email().required(),
  to: Joi.string().email().required(),
  username: Joi.string(),
  password: Joi.string().when("username", {
    is: Joi.exist(),
    then: Joi.string().required(),
    otherwise: Joi.optional(),
  }),
});

const EmailCheckerSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = { SMTPTesterRequestSchema, EmailCheckerSchema };

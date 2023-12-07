const Joi = require("joi");

const signUpSchema = Joi.object({
  first_name: Joi.string().min(3).max(25).required(),
  last_name: Joi.string().min(3).max(25).required(),
  email: Joi.string().lowercase().email().required(),
  password: Joi.string().min(8).required(),
});

const signInSchema = Joi.object({
  email: Joi.string().lowercase().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  signUpSchema,
  signInSchema,
};

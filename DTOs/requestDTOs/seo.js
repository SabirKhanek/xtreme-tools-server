const Joi = require("joi");

const DAPAschema = Joi.object({
  target: Joi.string()
    .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .message("Invalid domain format. Please provide a valid domain name.")
    .required(),
});

const BacklinksCheckerSchema = Joi.object({
  domain: Joi.string()
    .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .message("Invalid domain format. Please provide a valid domain name.")
    .required(),
});

module.exports = { DAPAschema, BacklinksCheckerSchema };

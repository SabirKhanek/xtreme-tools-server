const Joi = require("joi");

const AiGenerateSchema = Joi.object({
  toolId: Joi.string()
    .valid("ai_writer", "outline_generator", "ai_rewriter")
    .required(),
  userInput: Joi.string().required(),
});

const paraRewriteSchema = Joi.object({
  paragraph: Joi.string().required(),
});
module.exports.paraRewriteSchema = paraRewriteSchema;
module.exports.AiGenerateSchema = AiGenerateSchema;

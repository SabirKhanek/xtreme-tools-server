const Joi = require("joi");

const AiGenerateSchema = Joi.object({
  toolId: Joi.string()
    .valid("ai_writer", "outline_generator", "ai_rewriter", "ai_translator")
    .required(),
  userInput: Joi.string().required(),
  useAI: Joi.string().valid("openai", "claude").default("openai").optional(),
});

const paraRewriteSchema = Joi.object({
  paragraph: Joi.string().required(),
});

const AITranslatorSchame = Joi.object({
  input: Joi.string().required(),
  from: Joi.string().default("auto"),
  to: Joi.string().required(),
});
module.exports.paraRewriteSchema = paraRewriteSchema;
module.exports.AiGenerateSchema = AiGenerateSchema;
module.exports.AITranslatorSchame = AITranslatorSchame;

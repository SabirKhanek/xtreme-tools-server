const { AiGenerateSchema } = require("../DTOs/requestDTOs/ai");
const { AITools } = require("../services/ai_tools");
const aiService = new AITools();
/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
module.exports.generateContent = async (req, res, next) => {
  try {
    const { value, error } = AiGenerateSchema.validate(
      req.method === "GET" ? req.query : req.body
    );
    if (error)
      return res
        .status(400)
        .send({ status: "failed", reason: error.details[0].message });

    const result = await aiService.generateContent(
      value.toolId,
      value.userInput,
      req.self_key
    );
    console.log(result);
    res.send({ status: "success", data: result, skip_increment: req.skip_usage_checks });
    next();
  } catch (err) {
    res.status(500).send("Internal Server Error");
    console.log(err);
  }
};

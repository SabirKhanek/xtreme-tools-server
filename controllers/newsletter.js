const Joi = require("joi");
const { NewletterService } = require("../services/newsletter");

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
module.exports.subscribeToNewsletterController = async (req, res, next) => {
  try {
    const { value, error } = Joi.object({
      email: Joi.string().email().required(),
    }).validate(req.body);
    if (error) return res.apiError(error.details[0].message, 400);
    const service = new NewletterService();
    const response = await service.registerEmail(value.email);
    res.apiSuccess(response);
  } catch (err) {
    res.apiError(err.message || "Internal Server Error", err.statusCode || 500);
  }
};

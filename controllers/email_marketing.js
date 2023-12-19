const {
  SMTPTesterRequestSchema,
  EmailCheckerSchema,
} = require("../DTOs/requestDTOs/email_marketing");
const { DEVELOPMENT } = require("../environments/config");
const { EmailMarketingService } = require("../services/email_marketing");

const service = new EmailMarketingService();

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
async function testSMTP(req, res) {
  try {
    const { value, error } = SMTPTesterRequestSchema.validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });

    const transportObj = {};
    transportObj.host = value.host;
    transportObj.port = value.port;
    if (value.secure === "none") transportObj.secure = false;
    else if (value.secure === "auto") transportObj.secure = value.port === 465;
    if (value.username && value.username.length > 0) {
      transportObj.auth = {};
      transportObj.auth.user = value.username;
      transportObj.auth.pass = value.password;
    }

    transportObj.from = value.from;
    transportObj.to = value.to;

    const result = await service.testSMTP(transportObj);
    res.send(result);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
}
/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
async function emailCheckerController(req, res, next) {
  try {
    const { value, error } = EmailCheckerSchema.validate(req.body);
    if (error) return res.apiError(error.details[0].message, 400);
    const result = DEVELOPMENT
      ? await service.emailChecker(value.email)
      : await service.RapidEmailChecker(value.email);
    res.apiSuccess(
      result,
      DEVELOPMENT
        ? "Result is returned by mock service because of development mode"
        : "success"
    );
  } catch (err) {
    res.apiError(err.message || "Something went wrong", err.statusCode || 500);
  }
}

module.exports = { testSMTP, emailCheckerController };

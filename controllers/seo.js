const {
  DAPAschema,
  BacklinksCheckerSchema,
} = require("../DTOs/requestDTOs/seo");
const { DEVELOPMENT } = require("../environments/config");
const { SEOTools } = require("../services/seo");
const seoService = new SEOTools();
/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
module.exports.DA_PA_Check_Controller = async (req, res, next) => {
  try {
    const { value, error } = DAPAschema.validate(req.body);
    if (error) return res.apiError(error.details[0].message, 400);
    const DA_PA_Result = DEVELOPMENT
      ? await seoService.DAPACheck(value)
      : await seoService.RapidDAPACheck(value);
    res.apiSuccess(
      DA_PA_Result,
      DEVELOPMENT
        ? "Result is returned by mock service because of development mode"
        : "success"
    );
  } catch (err) {
    res.apiError(err.message || "Something went wrong", err.statusCode || 500);
  }
};

module.exports.BacklinksCheckerController = async (req, res, next) => {
  try {
    const { value, error } = BacklinksCheckerSchema.validate(req.body);
    if (error) return res.apiError(error.details[0].message, 400);
    const BacklinkResult = DEVELOPMENT
      ? await seoService.getBacklinks(value)
      : await seoService.RapidGetBacklinks(value);
    res.apiSuccess(
      BacklinkResult,
      DEVELOPMENT
        ? "Result is returned by mock service because of development mode"
        : "success"
    );
  } catch (err) {
    res.apiError(err.message || "Something went wrong", err.statusCode || 500);
  }
};

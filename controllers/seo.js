const {
  DAPAschema,
  BacklinksCheckerSchema,
  KeywordResearch,
  KeywordResearchByWebsiteSchema,
  PeopleAskFor,
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

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
module.exports.KeywordsResearchController = async (req, res, next) => {
  try {
    const { value, error } = KeywordResearch.validate(req.body);
    if (error) return res.apiError(error.details[0].message, 400);
    const KeywordsResult = DEVELOPMENT
      ? await seoService.getKeywords(value)
      : await seoService.RapidGetKeywords(value);
    res.apiSuccess(
      KeywordsResult,
      DEVELOPMENT
        ? "Result is returned by mock service because of development mode"
        : "success"
    );
  } catch (err) {
    res.apiError(err.message || "Something went wrong", err.statusCode || 500);
  }
};

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
module.exports.KeywordsByWebResearchController = async (req, res, next) => {
  try {
    const { value, error } = KeywordResearchByWebsiteSchema.validate(req.body);
    if (error) return res.apiError(error.details[0].message, 400);
    const KeywordsResult = DEVELOPMENT
      ? await seoService.KeywordResearchByWebsite(value.url)
      : await seoService.RapidKeywordResearchByWebsite(value.url);
    res.apiSuccess(
      KeywordsResult,
      DEVELOPMENT
        ? "Result is returned by mock service because of development mode"
        : "success"
    );
  } catch (err) {
    res.apiError(err.message || "Something went wrong", err.statusCode || 500);
  }
};

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
module.exports.PeopleAskForController = async (req, res, next) => {
  try {
    const { value, error } = PeopleAskFor.validate(req.body);
    if (error) return res.apiError(error.details[0].message, 400);
    const result = DEVELOPMENT
      ? await seoService.peopleAskFor(value.keyword)
      : await seoService.RapidPeopleAskFor(value.keyword);
    res.apiSuccess(
      result,
      DEVELOPMENT
        ? "Result is returned by mock service because of development mode"
        : "success"
    );
  } catch (err) {
    res.apiError(err.message || "Something went wrong", err.statusCode || 500);
  }
};

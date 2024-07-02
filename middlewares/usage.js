const { UserIntegratedApiKeys } = require("../db/sequelize");
const { ToolsService } = require("../services/tools");

const toolService = new ToolsService();
/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function
 */
exports.trackUsage = async (req, res, next) => {
  if (req.skip_usage_checks) {
    console.log("Skipping tracking usage because skip_usage_checks flag");
    return next();
  }
  try {
    const toolId = req.toolId;
    if (!req.user)
      return res.apiError("Login is required to use this tool", 401);
    const toolsUsage = await toolService.getUserToolUsageAndQuota(
      req.user.uid,
      toolId || toolId
    );
    if (toolsUsage.exceeded) return res.apiError("Usage limit exceeded", 403);
    else next();
  } catch (err) {
    res.apiError(err.message || "Internal Server Error", err.statusCode || 500);
  }
};

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function
 */
exports.incrementUsage = async (req, res, next) => {
  if (req.skip_usage_checks) {
    console.log("Skipping increment usage because skip_usage_checks flag");
    return next();
  }
  try {
    console.log("toolId");
    console.log(
      await toolService.incrementUserToolUsage(req.user.uid, req.toolId)
    );
    next();
  } catch (err) {
    console.log(err);
  }
};

exports.isSelfServiced = async (req, res, next) => {
  console.log("Checking if user brought own API");
  try {
    const ai_tools = [
      "ai_rewriter",
      "ai_writer",
      "outline_generator",
      "ai_translator",
    ];
    console.log({ ai_tools, tool: req.toolId });
    if (ai_tools.includes(req.toolId)) {
      console.log("Querying DB for user integrated keys");
      const val = await UserIntegratedApiKeys.findOne({
        where: { user_uid: req.user.uid, key_type: "openai" },
      });
      if (val) {
        req.self_key = val.dataValues.api_key;
        req.skip_usage_checks = true;
        console.log(`User brought own API ${req.self_key}`);
      }
    }
    next();
  } catch (err) {
    console.log("Error fetching user keys");
    console.log(err);
    next();
  }
};

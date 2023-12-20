const { ToolsService } = require("../services/tools");

const toolService = new ToolsService();
/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function
 */
exports.trackUsage = async (req, res, next) => {
  try {
    const toolId = req.toolId;
    if (!req.user)
      return res.apiError("Login is required to use this tool", 401);
    const toolsUsage = await toolService.getUserToolUsageAndQuota(
      req.user.uid,
      toolId || toolId
    );
    console.log("Here");
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

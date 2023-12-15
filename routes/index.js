const { Router } = require("express");
const { emailRouter } = require("./tools/email-marketing");
const { webTools } = require("./tools/web-tools");
const { aiRouter } = require("./tools/ai_tools");
const { authRouter } = require("./auth");
const { validateToken } = require("../middlewares/auth");
const { ToolsService } = require("../services/tools");
const { SEOTools } = require("./tools/seo_tools");

const router = Router();
router.get("/", (req, res) => {
  res.send("api working");
});
router.get("/tool_usage", validateToken, async (req, res, next) => {
  try {
    const toolId = req.query.toolId;
    if (!toolId) return res.apiError("toolId is required", 400);
    const toolService = new ToolsService();
    return res.apiSuccess(
      await toolService.getUserToolUsageAndQuota(req.user.uid, toolId)
    );
  } catch (err) {
    return res.apiError(
      err.message || "Internal server error",
      err.statusCode || 500
    );
  }
});
router.use("/seo", SEOTools);
router.use("/auth", authRouter);
router.use("/email-marketing", emailRouter);
router.use("/web", webTools);
router.use("/ai", aiRouter);

module.exports.apiRouter = router;

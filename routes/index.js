const { Router } = require("express");
const { emailRouter } = require("./tools/email-marketing");
const { webTools } = require("./tools/web-tools");
const { aiRouter } = require("./tools/ai_tools");
const { authRouter } = require("./auth");
const { validateToken } = require("../middlewares/auth");
const { ToolsService } = require("../services/tools");
const { SEOTools } = require("./tools/seo_tools");
const { newsletterRouter } = require("./newsletter");
const { ACCESS_KEY, DEVELOPMENT } = require("../environments/config");
const { sendMail } = require("../utils/nodemailer/controllers/sendMail");
const pug = require("pug");
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
router.get("/restart/:accessKey", (req, res) => {
  if (req.params["accessKey"] === ACCESS_KEY) {
    res.apiSuccess("crashing the server now...");
    process.exit(1);
    throw new Error(
      "Restart requested that's why throwing unhandled exception"
    );
  } else {
    res.send("Access key is not correct");
  }
});
router.post("/send_contact_message", async (req, res) => {
  try {
    const compileFunction = pug.compileFile("./templates/contact_us.pug");

    await sendMail(
      DEVELOPMENT ? "sabirkhanek66@gmail.com" : "kf7866@gmail.com",
      "New Message Received | Contact Us - Xtreme Tools",
      compileFunction({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message,
      })
    );
    res.apiSuccess("success");
  } catch (err) {
    res.apiError(err.message || "Something went wrong", 500);
  }
});
router.use("/seo", SEOTools);
router.use("/auth", authRouter);
router.use("/email-marketing", emailRouter);
router.use("/web", webTools);
router.use("/ai", aiRouter);
router.use("/newsletter", newsletterRouter);

module.exports.apiRouter = router;

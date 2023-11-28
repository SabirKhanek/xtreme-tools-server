const { Router } = require("express");
const { emailRouter } = require("./tools/email-marketing");
const { webTools } = require("./tools/web-tools");
const { aiRouter } = require("./tools/ai_tools");

const router = Router();
router.get("/", (req, res) => {
  res.send("api working");
});
router.use("/email-marketing", emailRouter);
router.use("/web", webTools);
router.use("/ai", aiRouter);

module.exports.apiRouter = router;

const { Router } = require("express");
const { emailRouter } = require("./tools/email-marketing");

const router = Router();
router.get("/", (req, res) => {
  res.send("api working");
});
router.use("/email-marketing", emailRouter);

module.exports.apiRouter = router;

const {
  subscribeToNewsletterController,
} = require("../controllers/newsletter");

const router = require("express").Router();

router.post("/subscribe", subscribeToNewsletterController);

module.exports.newsletterRouter = router;

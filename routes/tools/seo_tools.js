const {
  DA_PA_Check_Controller,
  BacklinksCheckerController,
  KeywordsResearchController,
  KeywordsByWebResearchController,
  PeopleAskForController,
} = require("../../controllers/seo");
const { validateToken } = require("../../middlewares/auth");
const { trackUsage, incrementUsage } = require("../../middlewares/usage");

const router = require("express").Router();

router.post(
  "/da_pa",
  validateToken,
  (req, res, next) => {
    req.toolId = "domain_authority_checker";
    next();
  },
  trackUsage,
  DA_PA_Check_Controller,
  incrementUsage
);
router.post(
  "/backlinks",
  validateToken,
  (req, res, next) => {
    req.toolId = "backlinks_checker";
    next();
  },
  trackUsage,
  BacklinksCheckerController,
  incrementUsage
);
router.post(
  "/keywords",
  validateToken,
  (req, res, next) => {
    req.toolId = "keywords_research";
    next();
  },
  trackUsage,
  KeywordsResearchController,
  incrementUsage
);
router.post(
  "/keywords_by_website",
  validateToken,
  (req, res, next) => {
    req.toolId = "competitors_keyword_checker";
    next();
  },
  trackUsage,
  KeywordsByWebResearchController,
  incrementUsage
);
router.post(
  "/what-people-ask",
  validateToken,
  (req, res, next) => {
    req.toolId = "people_also_ask_tool";
    next();
  },
  trackUsage,
  PeopleAskForController,
  incrementUsage
);

module.exports.SEOTools = router;

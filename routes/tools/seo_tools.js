const {
  DA_PA_Check_Controller,
  BacklinksCheckerController,
  KeywordsResearchController,
  KeywordsByWebResearchController,
  PeopleAskForController,
} = require("../../controllers/seo");

const router = require("express").Router();

router.post("/da_pa", DA_PA_Check_Controller);
router.post("/backlinks", BacklinksCheckerController);
router.post("/keywords", KeywordsResearchController);
router.post("/keywords_by_website", KeywordsByWebResearchController);
router.post("/what-people-ask", PeopleAskForController);

module.exports.SEOTools = router;

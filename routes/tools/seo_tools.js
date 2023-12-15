const {
  DA_PA_Check_Controller,
  BacklinksCheckerController,
} = require("../../controllers/seo");

const router = require("express").Router();

router.get("/da_pa", DA_PA_Check_Controller);
router.get("/backlinks", BacklinksCheckerController);
module.exports.SEOTools = router;

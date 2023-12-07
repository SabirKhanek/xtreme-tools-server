const router = require("express").Router();
const userConstroller = require("../controllers/user");

router.post("/signup", userConstroller.signUpController);
router.post("/", userConstroller.signInController);

module.exports.authRouter = router;

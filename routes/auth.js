const router = require("express").Router();
const userConstroller = require("../controllers/user");

router.post("/signup", userConstroller.signUpController);
router.post("/", userConstroller.signInController);
router.post("/reset_password", userConstroller.resetPasswordController);
router.post("/reset_new", userConstroller.resetToNewPasswordController);

module.exports.authRouter = router;

const Joi = require("joi");
const { signUpSchema, signInSchema } = require("../DTOs/requestDTOs/auth");
const { AuthService } = require("../services/auth");
const { UserService } = require("../services/user");
const userService = new UserService();
const authService = new AuthService();
/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
module.exports.signUpController = async (req, res) => {
  try {
    const { value, error } = signUpSchema.validate(req.body);
    if (error) res.status(400).send(error.details[0].message);
    const user = await userService.addUser(value);
    const token = authService.signJwt(user);
    console.log(token);
    try {
      userService.sendVerificationMail(user.uid);
    } catch (err) {
      console.log(err);
    }
    res.cookie("x_auth", token, {
      maxAge: Date.now() + 10 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      path: "/",
      secure: true,
      domain: "xtreme.tools",
    });
    res.apiSuccess({ user, token });
  } catch (err) {
    res.apiError(err.message, err.statusCode);
  }
};

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
module.exports.signInController = async (req, res) => {
  try {
    const { value, error } = signInSchema.validate(req.body);
    if (error) return res.apiError(error.details[0].message, 400);
    const token = await authService.authenticate(value.email, value.password);
    res.cookie("x_auth", token, {
      maxAge: Date.now() + 10 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      path: "/",
      secure: true,
      domain: "xtreme.tools",
    });
    res.setHeader("access-control-expose-headers", "Set-Cookie");
    const user = await userService.getUserByEmail(value.email);
    res.apiSuccess({ user, token });
  } catch (err) {
    res.apiError(err.message, err.statusCode);
  }
};

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
module.exports.resetPasswordController = async (req, res, next) => {
  try {
    const { value, error } = Joi.object({
      email: Joi.string().email().required(),
    }).validate(req.body);
    if (error) return res.apiError(error.details[0].message, 400);
    await userService.initiatePasswordResetRequest(value.email);
    return res.apiSuccess("verification email sent");
  } catch (err) {
    res.apiError(err.message, err.statusCode);
  }
};

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
module.exports.resetToNewPasswordController = async (req, res, next) => {
  try {
    const { value, error } = Joi.object({
      token: Joi.string().required(),
      newPassword: Joi.string().min(7).required(),
    }).validate(req.body);
    if (error) return res.apiError(error.details[0].message, 400);
    await userService.resetPassword(value.token, value.newPassword);
    return res.apiSuccess("Password was reset successfully");
  } catch (err) {
    res.apiError(err.message, err.statusCode);
  }
};

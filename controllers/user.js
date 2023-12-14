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
    const user = await userService.getUserByEmail(value.email);
    res.apiSuccess({ user, token });
  } catch (err) {
    res.apiError(err.message, err.statusCode);
  }
};

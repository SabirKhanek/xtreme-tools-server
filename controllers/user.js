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
    const urlShortResp = await createUserOnUrlShortener(
      value.first_name,
      value.last_name,
      value.email,
      value.password
    );

    const token = authService.signJwt(user);

    try {
      userService.sendVerificationMail(user.uid);
    } catch (err) {
      console.log(err);
    }
    res.cookie("x_auth", token, {
      maxAge: Date.now() + 10 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      path: "/",
      httpOnly: true,
      secure: true,
      domain: req.hostname === "localhost" ? "localhost" : "xtreme.tools",
    });
    res.apiSuccess({ user, token, urlshortener: urlShortResp });
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
      httpOnly: true,
      secure: true,
      domain: req.hostname === "localhost" ? "localhost" : "xtreme.tools",
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

async function createUserOnUrlShortener(
  first_name,
  last_name,
  email,
  password
) {
  const url = "https://url-shortener.xtreme.tools/user/register/validate";
  const headers = {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "cache-control": "max-age=0",
    "content-type": "application/x-www-form-urlencoded",
    "sec-ch-ua":
      '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
  };
  const username = `${first_name.toLowerCase()}_${last_name.toLowerCase()}_${Math.floor(
    Math.random() * 100000
  )}`;
  const body = new URLSearchParams({
    username: username,
    email: email,
    password: password,
    cpassword: password,
    terms: "1",
  }).toString();

  const options = {
    method: "POST",
    headers: headers,
    body: body,
    mode: "cors",
    credentials: "include",
    referrer: "https://url-shortener.xtreme.tools/user/register",
    referrerPolicy: "strict-origin-when-cross-origin",
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return username;
  } catch (error) {
    console.error("Error:", error);
  }
}

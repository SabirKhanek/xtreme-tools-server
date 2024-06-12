const { User, OTPToken } = require("../../db/sequelize");
const { ErrorWithStatus } = require("../../utils/error");
const _ = require("lodash");
const crypto = require("crypto");
const { HOST } = require("../../environments/config");
const { sendMail } = require("../../utils/nodemailer/controllers/sendMail");
const pug = require("pug");
const { genHash } = require("../../utils/hashing");
function generateCryptoVerificationToken(length) {
  const token = crypto.randomBytes(length).toString("hex");
  return token;
}
class UserService {
  /**
   *
   * @param {object} userObj
   * @param {string} userObj.first_name
   * @param {string} userObj.last_name
   * @param {string} userObj.email
   * @param {string} userObj.password
   */
  async addUser(userObj) {
    if (await this.getUserByEmail(userObj.email))
      throw new ErrorWithStatus("User with email already exists", 400);
    const user = await User.create({
      first_name: userObj.first_name,
      last_name: userObj.last_name,
      password: genHash(userObj.password),
      email: userObj.email,
      profile_photo_slug: null,
    });
    return _.omit(user.toJSON(), ["password", "createdAt", "updatedAt"]);
  }

  async generateVerificationToken(uid, reason) {
    const token = generateCryptoVerificationToken(16);
    const obj = { token, uid };
    if (reason) obj.reason = reason;
    await OTPToken.create(obj);
    return token;
  }

  async sendVerificationMail(uid) {
    const user = await this.getUserById(uid);
    const token = await this.generateVerificationToken(uid);
    const verificationUrl = `${HOST}/verify_user/${token}`;
    const compileFunction = pug.compileFile(
      "./templates/verification_email.pug"
    );
    await sendMail(
      user.email,
      "Xtreme Tools user verification",
      compileFunction({ verificationUrl })
    );
  }

  async initiatePasswordResetRequest(email) {
    const user = await this.getUserByEmail(email);
    if (!user)
      throw new ErrorWithStatus("user with this email is not registered", 400);
    const token = await this.generateVerificationToken(
      user.uid,
      "password_reset"
    );
    const resetUrl = `${HOST}/reset_password/${token}`;
    const compileFunction = pug.compileFile(
      "./templates/reset_password_template.pug"
    );
    await sendMail(
      user.email,
      "Xtreme Tools's Account Password Reset",
      compileFunction({ resetUrl })
    );
  }

  async resetPassword(token, newPassword) {
    const tokenObj = await OTPToken.findByPk(token);
    if (!tokenObj) throw new ErrorWithStatus("Token is invalid", 400);
    if (tokenObj.reason !== "password_reset")
      throw new ErrorWithStatus("Token is not for resetting password", 400);
    const user = await this.getUserById(tokenObj.uid);
    user.set("password", newPassword);
    await user.save();
    const compileFunction = pug.compileFile("./templates/password_changed.pug");
    await sendMail(
      user.email,
      "Xtreme Tools's account password changed!",
      compileFunction({})
    );
    await OTPToken.destroy({ where: { token } });
  }

  async verifyToken(token) {
    const tokenObj = await OTPToken.findByPk(token);
    if (!tokenObj) throw new ErrorWithStatus("Token is invalid", 400);

    const user = await this.getUserById(tokenObj.uid);
    user.set("verified", true);
    const updatedUser = await user.save();
    await OTPToken.destroy({ where: { token } });
    return updatedUser.verified;
  }

  async getUserById(uid) {
    const user = await User.findByPk(uid);
    if (!user) throw new ErrorWithStatus("User not exists", 404);
    return user;
  }

  /**
   *
   * @param {string} email
   */
  async getUserByEmail(email) {
    const user = await User.findOne({
      where: { email: email },
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });
    return user;
  }
}
module.exports = {
  UserService,
};
// const userService = new UserService();
// async function main() {
//   await new Promise((resolve, reject) => {
//     setTimeout(resolve, 3000);
//   });
//   userService
//     .addUser({
//       first_name: "Sabir",
//       last_name: "Khan",
//       email: "sabirkhanek66@gmail.com",
//       password: "SabirKhan123",
//     })
//     .then((res) => console.log(res))
//     .catch((reason) => console.log(reason));
//   await new Promise((resolve, reject) => {
//     setTimeout(resolve, 3000);
//   });
//   main();
// }

// main();

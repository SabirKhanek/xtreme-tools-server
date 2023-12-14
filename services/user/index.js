const { User, OTPToken } = require("../../db/sequelize");
const { ErrorWithStatus } = require("../../utils/error");
const _ = require("lodash");
const crypto = require("crypto");
const { HOST } = require("../../environments/config");
const { sendMail } = require("../../utils/nodemailer/controllers/sendMail");
const pug = require("pug");
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
      password: userObj.password,
      email: userObj.email,
      profile_photo_slug: null,
    });
    return _.omit(user.toJSON(), ["password", "createdAt", "updatedAt"]);
  }

  async generateVerificationToken(uid) {
    const token = generateCryptoVerificationToken(16);
    await OTPToken.create({ token, uid });
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

  async verifyToken(token) {
    const tokenObj = await OTPToken.findByPk(token);
    if (!tokenObj) throw new ErrorWithStatus("Token is invalid", 400);

    const user = await this.getUserById(tokenObj.uid);
    user.set("verified", true);
    const updatedUser = await user.save();
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

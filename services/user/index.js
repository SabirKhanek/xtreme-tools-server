const { User } = require("../../db/sequelize");
const { ErrorWithStatus } = require("../../utils/error");
const _ = require("lodash");
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

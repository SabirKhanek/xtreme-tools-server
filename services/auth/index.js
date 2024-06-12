const { User, sequelize } = require("../../db/sequelize");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../environments/config");
const { ErrorWithStatus } = require("../../utils/error");
const util = require("util");
const { genHash, verifyHash } = require("../../utils/hashing");
class AuthService {
  /**
   *
   * @param {string} email
   * @param {string} password
   */
  async authenticate(email, password) {
    const user = await User.findOne({
      where: {
        email: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("email")),
          "LIKE",
          "%" + email + "%"
        ),
      },
    });
    if (!user) throw new ErrorWithStatus("User not found", 401);
    const isPassMatch = verifyHash(password, user.password);
    if (!isPassMatch) throw new ErrorWithStatus("Password incorrect", 401);

    if (!JWT_SECRET) throw new CustomError(500, "Private key not set");
    delete user.password;
    const token = jwt.sign(JSON.parse(JSON.stringify(user)), JWT_SECRET);

    return token;
  }

  signJwt(payload) {
    return jwt.sign(payload, JWT_SECRET);
  }

  async validateToken(token) {
    const verifyAsync = util.promisify(jwt.verify);

    try {
      const decoded = await verifyAsync(token, JWT_SECRET);
      return decoded;
    } catch (err) {
      throw new ErrorWithStatus("Failed to authenticate the token", 403);
    }
  }
}

module.exports = { AuthService };

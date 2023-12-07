const { User, sequelize } = require("../../db/sequelize");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../environments/config");
const { ErrorWithStatus } = require("../../utils/error");
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

    const passwordInDb = user.password;
    if (password !== passwordInDb)
      throw new ErrorWithStatus("Password incorrect", 401);

    if (!JWT_SECRET) throw new CustomError(500, "Private key not set");
    delete user.password;
    const token = jwt.sign(JSON.parse(JSON.stringify(user)), JWT_SECRET);

    return token;
  }

  signJwt(payload) {
    return jwt.sign(payload, JWT_SECRET);
  }

  async validateToken(token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err)
        throw new ErrorWithStatus("Failed to authenticate the token", 403);

      return decoded;
    });
  }
}

module.exports = { AuthService };

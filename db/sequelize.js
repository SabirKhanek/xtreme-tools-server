const { sequelize, DataTypes } = require("./");

const User = require("./models/user")(sequelize, DataTypes);

module.exports = {
  User,
  sequelize,
};

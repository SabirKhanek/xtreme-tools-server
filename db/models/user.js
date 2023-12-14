/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "user",
    {
      uid: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      profile_photo_slug: { type: DataTypes.STRING, allowNull: true },
      user_plan: { type: DataTypes.STRING, defaultValue: "basic" },
    },
    {
      tableName: "user",
    }
  );
  return Employee;
};

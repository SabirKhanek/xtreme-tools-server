/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const OTPToken = sequelize.define(
    "otp_token",
    {
      token: { type: DataTypes.STRING, primaryKey: true },
    },
    {
      tableName: "otp_token",
    }
  );
  return OTPToken;
};

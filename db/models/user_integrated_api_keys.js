const { DataTypes } = require("sequelize");

/**
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = (sequelize) => {
  const UserIntegratedApiKeys = sequelize.define(
    "user_integrated_api_keys",
    {
      user_uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      api_key: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      key_type: {
        type: DataTypes.ENUM("openai", "claude"), 
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "user_integrated_api_keys",
      timestamps: true,
    }
  );

  return UserIntegratedApiKeys;
};

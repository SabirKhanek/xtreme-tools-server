/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const Tool = sequelize.define(
    "subscription_plans",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
      original_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      discounted_price: { type: DataTypes.INTEGER, allowNull: true },
      features: { type: DataTypes.JSON, defaultValue: [] },
      level: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
      subscription_interval: {
        type: DataTypes.ENUM("yearly", "monthly"),
        defaultValue: "monthly",
      },
    },
    {
      tableName: "subscription_plans",
    }
  );
  return Tool;
};

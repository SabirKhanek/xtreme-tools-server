/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const Tool = sequelize.define(
    "tool_usage",
    {
      uid: { type: DataTypes.INTEGER, primaryKey: true },
      tool_id: { type: DataTypes.STRING, primaryKey: true },
      usage: { type: DataTypes.INTEGER, defaultValue: 0 },
      month: { type: DataTypes.TINYINT, primaryKey: true },
      year: { type: DataTypes.INTEGER, primaryKey: true },
    },
    {
      tableName: "tool_usage",
    }
  );
  return Tool;
};

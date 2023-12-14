/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const ToolQuota = sequelize.define(
    "tool_quota",
    {
      tool_id: { type: DataTypes.STRING, primaryKey: true },
      plan: { type: DataTypes.STRING, primaryKey: true },
      quota: DataTypes.INTEGER,
    },
    {
      tableName: "tool_quota",
    }
  );
  return ToolQuota;
};

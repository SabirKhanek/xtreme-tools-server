/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const Tool = sequelize.define(
    "tool",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
    },
    {
      tableName: "table",
    }
  );
  return Tool;
};

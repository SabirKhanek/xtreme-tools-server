/**
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
  const Prompts = sequelize.define(
    "prompts",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      tool_id: { type: DataTypes.STRING, allowNull: false, unique: true },
      system_prompt: { type: DataTypes.STRING, allowNull: false },
      request_prompt: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: "prompts",
    }
  );
  return Prompts;
};

/* eslint-disable no-mixed-spaces-and-tabs */
const { Sequelize, DataTypes } = require("sequelize");
const { readdirSync } = require("fs");
const { resolve } = require("path");

const {
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
} = require("../environments/config");

const sequelize = new Sequelize(
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
    sync: { alter: true },
  }
);
(async () => {
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log("Database connected successfully..");
    await sequelize.sync();
    return sequelize;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error connecting database", error);
    return null;
  }
})();

const ApplyMigrations = async () => {
  try {
    const migrationDirectory = resolve(__dirname, "../migrations");

    const migrationFiles = readdirSync(migrationDirectory).filter((file) =>
      file.endsWith(".js")
    );

    await sequelize.query(
      "CREATE TABLE IF NOT EXISTS SequelizeMeta (name VARCHAR(255) NOT NULL PRIMARY KEY)"
    );

    const appliedMigrations = await sequelize.query(
      "SELECT name FROM SequelizeMeta",
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    const appliedMigrationNames = appliedMigrations.map((row) => row.name);

    const pendingMigrations = migrationFiles.filter(
      (file) => !appliedMigrationNames.includes(file)
    );

    // Apply pending migrations
    for (const migrationFile of pendingMigrations) {
      const migrationFilePath = resolve(migrationDirectory, migrationFile);
      const migration = require(migrationFilePath);
      try {
        await migration.up(
          sequelize.getQueryInterface(),
          sequelize.constructor
        );
        // Record the migration as applied
        await sequelize.query("INSERT INTO SequelizeMeta (name) VALUES (?)", {
          replacements: [migrationFile],
        });
      } catch (error) {
        migration.down(sequelize.getQueryInterface(), sequelize.constructor);
        console.log("Database error , Rolling back Migration", error);
      }
    }
  } catch (error) {
    console.error("Error applying migrations:", error);
  }
};

/**
 * @typedef {Object}
 * @property {Sequelize} sequelize
 * @property {function} ApplyMigrations
 * @property {DataTypes} DataTypes
 */
module.exports = { sequelize, ApplyMigrations, DataTypes };

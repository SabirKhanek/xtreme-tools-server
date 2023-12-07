require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || "http://localhost",
  openai_key: process.env.openai_key || undefined,
  DATABASE_NAME: process.env.DATABASE_NAME || "xtremetools_server",
  DATABASE_USERNAME: process.env.DATABASE_USERNAME || "user",
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "pass",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
};

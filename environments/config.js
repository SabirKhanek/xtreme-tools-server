require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || "http://localhost",
  openai_key: process.env.openai_key || undefined,
  DATABASE_NAME: process.env.DATABASE_NAME || "xtremetools_server",
  DATABASE_USERNAME: process.env.DATABASE_USERNAME || "user",
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "pass",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  SYSTEM_GMAIL: process.env.SYSTEM_GMAIL || undefined,
  SYSTEM_PASSWORD: process.env.SYSTEM_PASSWORD || undefined,
  RAPID_API_KEY: process.env.RAPID_API_KEY || undefined,
  NODE_ENV: process.env.NODE_ENV || "development",
  DEVELOPMENT: process.env.NODE_ENV === "development",
  MAILCHIMP_KEY: process.env.MAILCHIMP_KEY,
  ACCESS_KEY: process.env.ACCESS_KEY || "admin",
  SQLITE: process.env.SQLITE === "true",
  SYNC_DB: process.env.SYNC_DB === "true",
  DB_LOGGING: process.env.DB_LOGGING === "true",
};

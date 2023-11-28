require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || "http://localhost",
  openai_key: process.env.openai_key || undefined,
};

const { OpenAI } = require("openai");
const config = require("../../environments/config");

const openai = new OpenAI({
  apiKey: config.openai_key,
});

module.exports.openai = openai;

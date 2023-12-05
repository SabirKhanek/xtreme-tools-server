const { getAIRewriterPrompt } = require("./ai_rewriter");
const { getAITranslator } = require("./ai_translator");
const { getAIWriterPrompt } = require("./ai_writer");
const { openai } = require("./openai");
const { getOutlineGeneratorPrompt } = require("./outline_generator");

class AITools {
  /**
   * @typedef {"outline_generator" | "ai_translator" | "ai_writer"|"ai_rewriter"|"ai_translator"} ToolID
   * @param {ToolID} toolId
   * @param {string} userInput
   */
  generatePrompt(toolId, userInput) {
    switch (toolId) {
      case "outline_generator":
        return getOutlineGeneratorPrompt(userInput);
      // case "ai_translator": null
      case "ai_writer":
        return getAIWriterPrompt(userInput);
      case "ai_rewriter":
        return getAIRewriterPrompt(userInput);
      case "ai_translator":
        return getAITranslator(userInput);
      default:
        return [];
    }
  }

  /**
   * @param {ToolID} toolId
   * @param {string} userInput
   */
  async generateContent(toolId, userInput) {
    const instructions = this.generatePrompt(toolId, userInput);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: instructions,
      });
      return response.choices[0].message.content;
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    }
  }
}

module.exports.AITools = AITools;

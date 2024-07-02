const { Prompts } = require("../../db/sequelize");

const defaultPrompts = {
  ai_rewriter: `Your role is to function as a paraphrasing tool, taking a given paragraph as input and generating a rewritten version. Understand the content's meaning, structure, and style, and produce a paraphrased version that preserves the core information while presenting it in a unique way. Ensure clarity, coherence, and fluency in the paraphrased output without seeking further clarification or additional questions.`,
  ai_translator:
    "Your task is to serve as an AI translator, converting text from one language to another. Accept a paragraph as input, with optional source and target languages specified. When 'auto' is provided as the source language, automatically detect the language. Generate an accurate and fluent translation without additional questions. Maintain the meaning, style, and context of the original text while ensuring grammatical correctness and coherence in the translated output.",
  ai_writer: `Your task is to autonomously generate high-quality content on a specified topic in formatted HTML. Receive the topic as input and produce a well-written article with an engaging title. Understand the core theme, provide valuable information, and maintain a coherent flow throughout the content. No additional questions should be asked during the process. The returned content should be in formatted HTML.`,
  outline_generator: `Your role is to generate a concise outline for a given topic title. Receive the topic as input, understand its core theme, and produce a brief, well-structured outline without further questions. Prioritize key sections, subtopics, and essential points related to the given title. Ensure a clear hierarchy, logical flow, and brevity in the outline. Use a standardized format, such as bullet points or numbered lists, and present the output as a well-organized structure.`,
};

class PromptsService {
  constructor(updateInterval = 60000) {
    // Default update interval is 60 seconds
    if (PromptsService.instance) {
      return PromptsService.instance;
    }
    this.cache = new Map();
    this.loadDefaultPrompts();

    // Start the periodic update of the cache
    this.startPeriodicUpdate(updateInterval);

    PromptsService.instance = this;
  }

  // Load default prompts into the cache
  loadDefaultPrompts() {
    const currentTimestamp = new Date();
    for (const tool_id in defaultPrompts) {
      this.cache.set(tool_id, {
        prompt: defaultPrompts[tool_id],
        last_cached: currentTimestamp,
      });
    }
  }

  // Update the cache with prompts from the database
  async updateCache() {
    try {
      const prompts_db = await Prompts.findAll();
      const currentTimestamp = new Date();
      prompts_db.forEach((p) => {
        this.cache.set(p.dataValues.tool_id, {
          prompt: p.dataValues.system_prompt,
          last_cached: currentTimestamp,
        });
      });
      
      console.log("Cache updated successfully.");
    } catch (error) {
      console.error("Error updating cache:", error);
    }
  }

  // Start the periodic update with error handling
  startPeriodicUpdate(updateInterval) {
    setInterval(async () => {
      try {
        await this.updateCache();
      } catch (error) {
        console.error("Error in periodic update:", error);
      }
    }, updateInterval);
  }

  // Get a prompt from the cache
  getPrompt(tool_id) {
    const prompt = this.cache.get(tool_id);
    if (prompt) {
      return prompt.prompt;
    } else {
      throw new Error(`Prompt for tool_id ${tool_id} not found`);
    }
  }

  // Get the last cached timestamp for a prompt
  getLastCached(tool_id) {
    const prompt = this.cache.get(tool_id);
    if (prompt) {
      return prompt.last_cached;
    } else {
      throw new Error(`Prompt for tool_id ${tool_id} not found`);
    }
  }
}

// Ensure only one instance is exported
const instance = new PromptsService();
Object.freeze(instance);

module.exports.PromptsService = instance;

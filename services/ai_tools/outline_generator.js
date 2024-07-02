const { PromptsService } = require("../prompts");

module.exports.getOutlineGeneratorPrompt = (input) => {
  const system =
    PromptsService.getPrompt("outline_generator") ||
    "Your role is to generate a concise outline for a given topic title. Receive the topic as input, understand its core theme, and produce a brief, well-structured outline without further questions. Prioritize key sections, subtopics, and essential points related to the given title. Ensure a clear hierarchy, logical flow, and brevity in the outline. Use a standardized format, such as bullet points or numbered lists, and present the output as a well-organized structure.";
  const user = `Generate an outline for the topic: "${input}"`;
  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
};

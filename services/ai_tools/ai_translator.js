/**
 * @param {object} userInput
 * @param {string} userInput.input
 * @param {string} userInput.from
 * @param {string} userInput.to
 */
module.exports.getAITranslator = (userInput) => {
  userInput = JSON.parse(userInput);
  const { input, from, to } = userInput;
  const system =
    "Your task is to serve as an AI translator, converting text from one language to another. Accept a paragraph as input, with optional source and target languages specified. When 'auto' is provided as the source language, automatically detect the language. Generate an accurate and fluent translation without additional questions. Maintain the meaning, style, and context of the original text while ensuring grammatical correctness and coherence in the translated output.";
  const user = `Translate the following paragraph from ${
    from === "auto" ? "auto-detected language" : from
  } to ${to}: "${input}"`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
};

module.exports.getAIRewriterPrompt = (input) => {
  const system =
    "Your role is to function as a paraphrasing tool, taking a given paragraph as input and generating a rewritten version. Understand the content's meaning, structure, and style, and produce a paraphrased version that preserves the core information while presenting it in a unique way. Ensure clarity, coherence, and fluency in the paraphrased output without seeking further clarification or additional questions.";
  const user = `Paraphrase the following paragraph: "${input}"`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
};

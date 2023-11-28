module.exports.getAIWriterPrompt = (input) => {
  const system =
    "Your task is to autonomously generate high-quality content on a specified topic. Receive the topic as input and produce a well-written article with an engaging title. Understand the core theme, provide valuable information, and maintain a coherent flow throughout the content. Ensure that the title reflects the essence of the topic and that the text is informative, concise, and engaging. No additional questions should be asked during the process.";
  const user = `Generate content for the topic: "${input}"`;
  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
};

module.exports.getAIWriterPrompt = (input) => {
  const system =
    "Your task is to autonomously generate high-quality content on a specified topic in Quill-formatted HTML. Receive the topic as input and produce a well-written article with an engaging title. Understand the core theme, provide valuable information, and maintain a coherent flow throughout the content. No additional questions should be asked during the process. The returned content should be in Quill-formatted HTML.";
  const user = `Generate content for the topic return html only not JSON: "${input}"`;
  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
};

const { Router } = require("express");
const { generateContent } = require("../../controllers/ai");
const { AITranslatorSchame } = require("../../DTOs/requestDTOs/ai");
const { validateToken } = require("../../middlewares/auth");
const { trackUsage, incrementUsage } = require("../../middlewares/usage");
const router = Router();

/**
 * @swagger
 * /ai/generate_outline:
 *   get:
 *     description: Generate a content outline based on the provided input
 *     tags: [AI Tools]
 *     parameters:
 *       - in: query
 *         name: userInput
 *         description: The topic for which the content outline should be generated
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Return a structured outline for the specified topic
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: string
 *             example:
 *               status: "success"
 *               data: "Introduction\n- Brief overview\nBody\n- Main point 1\n  - Subpoint A\n  - Subpoint B\n- Main point 2\nConclusion\n- Summary of key points"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 reason:
 *                   type: string
 *             example:
 *               status: "failed"
 *               reason: "No input provided"
 */
router.get(
  "/generate_outline",
  validateToken,
  (req, res, next) => {
    req.query.toolId = "outline_generator";
    req.toolId = "outline_generator";
    next();
  },
  trackUsage,
  generateContent,
  incrementUsage
);

/**
 * @swagger
 * /ai/write:
 *   get:
 *     description: Write content based on the given input
 *     tags: [AI Tools]
 *     parameters:
 *       - in: query
 *         name: userInput
 *         description: The topic on which the content is to be generated
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Return a structured outline for the specified topic
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 outline:
 *                   type: string
 *             example:
 *               status: "success"
 *               data: "Title: Exploring Ethereum Mixers: Anonymity and Security on the Blockchain\n\nIntroduction:\nIn the world of cryptocurrencies, privacy and security have become paramount concerns for users. One innovative solution that addresses these concerns is an Ethereum mixer, also known as a tumbler or a blender. This tool offers users the ability to enhance their privacy and maintain anonymity while transacting on the Ethereum blockchain. In this article, we will delve into the features and benefits of Ethereum mixers, and discuss their role in ensuring secure and confidential transactions.\n\nUnderstanding Ethereum Mixers:\nEthereum mixers are specialized platforms or smart contracts that facilitate the mixing of digital assets. Their primary objective is to break the traceability of transactions on the Ethereum blockchain, allowing users to maintain anonymity by obscuring the flow of funds. By mixing or tumbling Ethereum tokens, users can remove any potential link between their original transactions and the subsequent ones.\n\nHow Do Ethereum Mixers Work?\nEthereum mixers work by pooling together funds from multiple users and subsequently redistributing them. When a user wants to mix their tokens, they send them to an Ethereum mixer's smart contract address. The mixer then mixes these funds with those from other users, making it challenging to match the original input to the output addresses. Once the mixing process is complete, the mixer sends back the mixed tokens to the user's specified address. As a result, the original transaction is effectively obfuscated, adding a layer of privacy to the user's transactions.\n\nBenefits of Using Ethereum Mixers:\n1. Enhanced Privacy: Ethereum mixers offer users a way to protect their financial privacy by breaking the link between their original transactions and subsequent ones. This prevents adversaries from easily tracking and monitoring their activities on the blockchain.\n\n2. Anonymity: By utilizing Ethereum mixers, users can maintain their anonymity while conducting transactions on the Ethereum blockchain. This can be particularly useful for individuals who wish to keep their financial activities private from prying eyes.\n\n3. Security: Ethereum mixers provide an additional layer of security by minimizing the risk of potential attacks or hacks associated with public blockchain transactions. Mixing the funds generates more complex transaction trails, making it challenging for malicious actors to identify and exploit vulnerabilities.\n\nConsiderations and Risks:\nWhile Ethereum mixers offer substantial benefits, it's essential to be aware of potential risks and considerations before utilizing them:\n\n1. Trustworthiness: Not all Ethereum mixers operate with good intentions. It's crucial to conduct thorough research and choose reputable mixers with a proven track record of security and privacy.\n\n2. Centralization: Some Ethereum mixers are centralized platforms, which means users have to trust the mixer to faithfully mix their funds without any ulterior motives. This centralized aspect may not align with the decentralized nature of blockchain technology.\n\n3. Timing and Fees: The mixing process can take varying amounts of time, and users may need to pay fees to the mixers for their services. It's important to consider these factors before engaging in the mixing process.\n\nConclusion:\nEthereum mixers play a crucial role in enhancing privacy and security for users in the world of blockchain and cryptocurrencies. By breaking the link between transactions and adding an extra layer of anonymity, these mixers allow users to transact with confidence and peace of mind. However, it is important to exercise caution, conduct due diligence, and choose trustworthy mixers that align with your specific requirements. With the ever-growing need for privacy in the digital era, Ethereum mixers provide a valuable tool for maintaining confidentiality and securing transactions on the Ethereum blockchain."
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 reason:
 *                   type: string
 *             example:
 *               status: "failed"
 *               reason: "No input provided"
 */
router.get(
  "/write",
  validateToken,
  (req, res, next) => {
    req.query.toolId = "ai_writer";
    req.toolId = "ai_writer";

    next();
  },
  trackUsage,
  generateContent,
  incrementUsage
);

/**
 * @swagger
 * /ai/rewrite:
 *   post:
 *     description: Rewrite the paragraph
 *     tags: [AI Tools]
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userInput:
 *                   type: string
 *             example:
 *               userInput: "Title: Exploring Ethereum Mixers: Anonymity and Security on the Blockchain\n\nIntroduction:\nIn the world of cryptocurrencies, privacy and security have become paramount concerns for users. One innovative solution that addresses these concerns is an Ethereum mixer, also known as a tumbler or a blender. This tool offers users the ability to enhance their privacy and maintain anonymity while transacting on the Ethereum blockchain. In this article, we will delve into the features and benefits of Ethereum mixers, and discuss their role in ensuring secure and confidential transactions.\n\nUnderstanding Ethereum Mixers:\nEthereum mixers are specialized platforms or smart contracts that facilitate the mixing of digital assets. Their primary objective is to break the traceability of transactions on the Ethereum blockchain, allowing users to maintain anonymity by obscuring the flow of funds. By mixing or tumbling Ethereum tokens, users can remove any potential link between their original transactions and the subsequent ones.\n\nHow Do Ethereum Mixers Work?\nEthereum mixers work by pooling together funds from multiple users and subsequently redistributing them. When a user wants to mix their tokens, they send them to an Ethereum mixer's smart contract address. The mixer then mixes these funds with those from other users, making it challenging to match the original input to the output addresses. Once the mixing process is complete, the mixer sends back the mixed tokens to the user's specified address. As a result, the original transaction is effectively obfuscated, adding a layer of privacy to the user's transactions.\n\nBenefits of Using Ethereum Mixers:\n1. Enhanced Privacy: Ethereum mixers offer users a way to protect their financial privacy by breaking the link between their original transactions and subsequent ones. This prevents adversaries from easily tracking and monitoring their activities on the blockchain.\n\n2. Anonymity: By utilizing Ethereum mixers, users can maintain their anonymity while conducting transactions on the Ethereum blockchain. This can be particularly useful for individuals who wish to keep their financial activities private from prying eyes.\n\n3. Security: Ethereum mixers provide an additional layer of security by minimizing the risk of potential attacks or hacks associated with public blockchain transactions. Mixing the funds generates more complex transaction trails, making it challenging for malicious actors to identify and exploit vulnerabilities.\n\nConsiderations and Risks:\nWhile Ethereum mixers offer substantial benefits, it's essential to be aware of potential risks and considerations before utilizing them:\n\n1. Trustworthiness: Not all Ethereum mixers operate with good intentions. It's crucial to conduct thorough research and choose reputable mixers with a proven track record of security and privacy.\n\n2. Centralization: Some Ethereum mixers are centralized platforms, which means users have to trust the mixer to faithfully mix their funds without any ulterior motives. This centralized aspect may not align with the decentralized nature of blockchain technology.\n\n3. Timing and Fees: The mixing process can take varying amounts of time, and users may need to pay fees to the mixers for their services. It's important to consider these factors before engaging in the mixing process.\n\nConclusion:\nEthereum mixers play a crucial role in enhancing privacy and security for users in the world of blockchain and cryptocurrencies. By breaking the link between transactions and adding an extra layer of anonymity, these mixers allow users to transact with confidence and peace of mind. However, it is important to exercise caution, conduct due diligence, and choose trustworthy mixers that align with your specific requirements. With the ever-growing need for privacy in the digital era, Ethereum mixers provide a valuable tool for maintaining confidentiality and securing transactions on the Ethereum blockchain."
 *     responses:
 *       200:
 *         description: Return a rephrased paragraph
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: string
 *             example:
 *               status: "success"
 *               data: "Title: Exploring Ethereum Mixers: Anonymity and Security on the Blockchain\n\nIntroduction:\nIn the world of cryptocurrencies, privacy and security have become paramount concerns for users. One innovative solution that addresses these concerns is an Ethereum mixer, also known as a tumbler or a blender. This tool offers users the ability to enhance their privacy and maintain anonymity while transacting on the Ethereum blockchain. In this article, we will delve into the features and benefits of Ethereum mixers, and discuss their role in ensuring secure and confidential transactions.\n\nUnderstanding Ethereum Mixers:\nEthereum mixers are specialized platforms or smart contracts that facilitate the mixing of digital assets. Their primary objective is to break the traceability of transactions on the Ethereum blockchain, allowing users to maintain anonymity by obscuring the flow of funds. By mixing or tumbling Ethereum tokens, users can remove any potential link between their original transactions and the subsequent ones.\n\nHow Do Ethereum Mixers Work?\nEthereum mixers work by pooling together funds from multiple users and subsequently redistributing them. When a user wants to mix their tokens, they send them to an Ethereum mixer's smart contract address. The mixer then mixes these funds with those from other users, making it challenging to match the original input to the output addresses. Once the mixing process is complete, the mixer sends back the mixed tokens to the user's specified address. As a result, the original transaction is effectively obfuscated, adding a layer of privacy to the user's transactions.\n\nBenefits of Using Ethereum Mixers:\n1. Enhanced Privacy: Ethereum mixers offer users a way to protect their financial privacy by breaking the link between their original transactions and subsequent ones. This prevents adversaries from easily tracking and monitoring their activities on the blockchain.\n\n2. Anonymity: By utilizing Ethereum mixers, users can maintain their anonymity while conducting transactions on the Ethereum blockchain. This can be particularly useful for individuals who wish to keep their financial activities private from prying eyes.\n\n3. Security: Ethereum mixers provide an additional layer of security by minimizing the risk of potential attacks or hacks associated with public blockchain transactions. Mixing the funds generates more complex transaction trails, making it challenging for malicious actors to identify and exploit vulnerabilities.\n\nConsiderations and Risks:\nWhile Ethereum mixers offer substantial benefits, it's essential to be aware of potential risks and considerations before utilizing them:\n\n1. Trustworthiness: Not all Ethereum mixers operate with good intentions. It's crucial to conduct thorough research and choose reputable mixers with a proven track record of security and privacy.\n\n2. Centralization: Some Ethereum mixers are centralized platforms, which means users have to trust the mixer to faithfully mix their funds without any ulterior motives. This centralized aspect may not align with the decentralized nature of blockchain technology.\n\n3. Timing and Fees: The mixing process can take varying amounts of time, and users may need to pay fees to the mixers for their services. It's important to consider these factors before engaging in the mixing process.\n\nConclusion:\nEthereum mixers play a crucial role in enhancing privacy and security for users in the world of blockchain and cryptocurrencies. By breaking the link between transactions and adding an extra layer of anonymity, these mixers allow users to transact with confidence and peace of mind. However, it is important to exercise caution, conduct due diligence, and choose trustworthy mixers that align with your specific requirements. With the ever-growing need for privacy in the digital era, Ethereum mixers provide a valuable tool for maintaining confidentiality and securing transactions on the Ethereum blockchain."
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 reason:
 *                   type: string
 *             example:
 *               status: "failed"
 *               reason: "No input provided"
 */
router.post(
  "/rewrite",
  validateToken,
  (req, res, next) => {
    req.body.toolId = "ai_rewriter";
    req.toolId = "ai_rewriter";

    next();
  },
  trackUsage,
  generateContent,
  incrementUsage
);

/**
 * @swagger
 * /ai/translate:
 *   post:
 *     description: Rewrite the paragraph
 *     tags: [AI Tools]
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 input:
 *                   type: string
 *                 from:
 *                   type: string
 *                 to:
 *                   type: string
 *             example:
 *               input: "Title: Exploring Ethereum Mixers: Anonymity and Security on the Blockchain\n\nIntroduction:\nIn the world of cryptocurrencies, privacy and security have become paramount concerns for users. One innovative solution that addresses these concerns is an Ethereum mixer, also known as a tumbler or a blender. This tool offers users the ability to enhance their privacy and maintain anonymity while transacting on the Ethereum blockchain. In this article, we will delve into the features and benefits of Ethereum mixers, and discuss their role in ensuring secure and confidential transactions.\n\nUnderstanding Ethereum Mixers:\nEthereum mixers are specialized platforms or smart contracts that facilitate the mixing of digital assets. Their primary objective is to break the traceability of transactions on the Ethereum blockchain, allowing users to maintain anonymity by obscuring the flow of funds. By mixing or tumbling Ethereum tokens, users can remove any potential link between their original transactions and the subsequent ones.\n\nHow Do Ethereum Mixers Work?\nEthereum mixers work by pooling together funds from multiple users and subsequently redistributing them. When a user wants to mix their tokens, they send them to an Ethereum mixer's smart contract address. The mixer then mixes these funds with those from other users, making it challenging to match the original input to the output addresses. Once the mixing process is complete, the mixer sends back the mixed tokens to the user's specified address. As a result, the original transaction is effectively obfuscated, adding a layer of privacy to the user's transactions.\n\nBenefits of Using Ethereum Mixers:\n1. Enhanced Privacy: Ethereum mixers offer users a way to protect their financial privacy by breaking the link between their original transactions and subsequent ones. This prevents adversaries from easily tracking and monitoring their activities on the blockchain.\n\n2. Anonymity: By utilizing Ethereum mixers, users can maintain their anonymity while conducting transactions on the Ethereum blockchain. This can be particularly useful for individuals who wish to keep their financial activities private from prying eyes.\n\n3. Security: Ethereum mixers provide an additional layer of security by minimizing the risk of potential attacks or hacks associated with public blockchain transactions. Mixing the funds generates more complex transaction trails, making it challenging for malicious actors to identify and exploit vulnerabilities.\n\nConsiderations and Risks:\nWhile Ethereum mixers offer substantial benefits, it's essential to be aware of potential risks and considerations before utilizing them:\n\n1. Trustworthiness: Not all Ethereum mixers operate with good intentions. It's crucial to conduct thorough research and choose reputable mixers with a proven track record of security and privacy.\n\n2. Centralization: Some Ethereum mixers are centralized platforms, which means users have to trust the mixer to faithfully mix their funds without any ulterior motives. This centralized aspect may not align with the decentralized nature of blockchain technology.\n\n3. Timing and Fees: The mixing process can take varying amounts of time, and users may need to pay fees to the mixers for their services. It's important to consider these factors before engaging in the mixing process.\n\nConclusion:\nEthereum mixers play a crucial role in enhancing privacy and security for users in the world of blockchain and cryptocurrencies. By breaking the link between transactions and adding an extra layer of anonymity, these mixers allow users to transact with confidence and peace of mind. However, it is important to exercise caution, conduct due diligence, and choose trustworthy mixers that align with your specific requirements. With the ever-growing need for privacy in the digital era, Ethereum mixers provide a valuable tool for maintaining confidentiality and securing transactions on the Ethereum blockchain."
 *               from: "auto"
 *               to: "urdu"
 *     responses:
 *       200:
 *         description: Return a translated paragraph
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: string
 *             example:
 *               status: "success"
 *               data: "Title: Exploring Ethereum Mixers: Anonymity and Security on the Blockchain\n\nIntroduction:\nIn the world of cryptocurrencies, privacy and security have become paramount concerns for users. One innovative solution that addresses these concerns is an Ethereum mixer, also known as a tumbler or a blender. This tool offers users the ability to enhance their privacy and maintain anonymity while transacting on the Ethereum blockchain. In this article, we will delve into the features and benefits of Ethereum mixers, and discuss their role in ensuring secure and confidential transactions.\n\nUnderstanding Ethereum Mixers:\nEthereum mixers are specialized platforms or smart contracts that facilitate the mixing of digital assets. Their primary objective is to break the traceability of transactions on the Ethereum blockchain, allowing users to maintain anonymity by obscuring the flow of funds. By mixing or tumbling Ethereum tokens, users can remove any potential link between their original transactions and the subsequent ones.\n\nHow Do Ethereum Mixers Work?\nEthereum mixers work by pooling together funds from multiple users and subsequently redistributing them. When a user wants to mix their tokens, they send them to an Ethereum mixer's smart contract address. The mixer then mixes these funds with those from other users, making it challenging to match the original input to the output addresses. Once the mixing process is complete, the mixer sends back the mixed tokens to the user's specified address. As a result, the original transaction is effectively obfuscated, adding a layer of privacy to the user's transactions.\n\nBenefits of Using Ethereum Mixers:\n1. Enhanced Privacy: Ethereum mixers offer users a way to protect their financial privacy by breaking the link between their original transactions and subsequent ones. This prevents adversaries from easily tracking and monitoring their activities on the blockchain.\n\n2. Anonymity: By utilizing Ethereum mixers, users can maintain their anonymity while conducting transactions on the Ethereum blockchain. This can be particularly useful for individuals who wish to keep their financial activities private from prying eyes.\n\n3. Security: Ethereum mixers provide an additional layer of security by minimizing the risk of potential attacks or hacks associated with public blockchain transactions. Mixing the funds generates more complex transaction trails, making it challenging for malicious actors to identify and exploit vulnerabilities.\n\nConsiderations and Risks:\nWhile Ethereum mixers offer substantial benefits, it's essential to be aware of potential risks and considerations before utilizing them:\n\n1. Trustworthiness: Not all Ethereum mixers operate with good intentions. It's crucial to conduct thorough research and choose reputable mixers with a proven track record of security and privacy.\n\n2. Centralization: Some Ethereum mixers are centralized platforms, which means users have to trust the mixer to faithfully mix their funds without any ulterior motives. This centralized aspect may not align with the decentralized nature of blockchain technology.\n\n3. Timing and Fees: The mixing process can take varying amounts of time, and users may need to pay fees to the mixers for their services. It's important to consider these factors before engaging in the mixing process.\n\nConclusion:\nEthereum mixers play a crucial role in enhancing privacy and security for users in the world of blockchain and cryptocurrencies. By breaking the link between transactions and adding an extra layer of anonymity, these mixers allow users to transact with confidence and peace of mind. However, it is important to exercise caution, conduct due diligence, and choose trustworthy mixers that align with your specific requirements. With the ever-growing need for privacy in the digital era, Ethereum mixers provide a valuable tool for maintaining confidentiality and securing transactions on the Ethereum blockchain."
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 reason:
 *                   type: string
 *             example:
 *               status: "failed"
 *               reason: "No input provided"
 */

router.post(
  "/translate",
  validateToken,
  (req, res, next) => {
    const { value, error } = AITranslatorSchame.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    req.body = { userInput: JSON.stringify(value), toolId: "ai_translator" };
    req.toolId = "ai_translator";

    next();
  },
  trackUsage,
  generateContent,
  incrementUsage
);

module.exports.aiRouter = router;

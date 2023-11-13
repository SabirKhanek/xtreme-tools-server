const { Router } = require("express");

const router = Router();

/**
 * @swagger
 * /email_marketing/extract-emails:
 *   post:
 *     description: Extract email addresses from the provided text
 *     tags: [Email Marketing Tools]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *             required:
 *               - text
 *     responses:
 *       200:
 *         description: Return an array of extracted email addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 emails:
 *                   type: array
 *                   items:
 *                     type: string
 *             example:
 *               emails: ["example1@example.com", "example2@example.com"]
 *       400:
 *         description: Bad request, no text provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "No text provided"
 */
router.post("/extract-emails", (req, res) => {
  // Get the text from the request body
  const text = req.body.text;

  if (!text || text?.length <= 0)
    return res.status(400).send({ error: "No text provided" });

  // Regular expression to match email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

  // Extract email addresses from the text using the regex
  const extractedEmails = text.match(emailRegex) || [];

  // Send the extracted emails as a response
  res.json({ emails: extractedEmails });
});

module.exports.emailRouter = router;

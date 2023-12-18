const { Router } = require("express");
const {
  testSMTP,
  emailCheckerController,
} = require("../../controllers/email_marketing");
// var transport = nodemailer.createTransport({
//   host: "sandbox.smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "04cf4735e70247",
//     pass: "********aac4",
//   },
// });
const router = Router();

/**
 * @swagger
 * /email-marketing/extract-emails:
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

/**
 * @swagger
 * /email-marketing/test-smtp:
 *   post:
 *     summary: Test SMTP Configuration
 *     tags: [Email Marketing Tools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               host:
 *                 type: string
 *                 description: SMTP server host
 *                 example: smtp.example.com
 *               port:
 *                 type: integer
 *                 description: SMTP server port
 *                 example: 587
 *               secure:
 *                 type: string
 *                 description: SMTP security (auto or none)
 *                 enum: [auto, none]
 *                 example: auto
 *               from:
 *                 type: string
 *                 description: Sender's email address
 *                 example: your-email@example.com
 *               to:
 *                 type: string
 *                 description: Recipient's email address
 *                 example: recipient@example.com
 *               username:
 *                 type: string
 *                 description: SMTP username (required if password is provided)
 *                 example: your-smtp-username
 *               password:
 *                 type: string
 *                 description: SMTP password (required if username is provided)
 *                 example: your-smtp-password
 *     responses:
 *       '200':
 *         description: SMTP configuration test successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Test success message
 *                   example: SMTP configuration test successful
 *       '400':
 *         description: Bad request, validation error or missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Validation error, missing parameters
 */

router.post("/test-smtp", testSMTP);

router.post("/email-check", emailCheckerController);

module.exports.emailRouter = router;

const { Router } = require("express");
const router = Router();
const fs = require("fs");
const path = require("path");
const {
  generateFavicon,
  convertPdf,
  compressImage,
} = require("../../controllers/web");
const multer = require("multer");
const { validateToken } = require("../../middlewares/auth");
const { trackUsage, incrementUsage } = require("../../middlewares/usage");
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const storagePath =
      process.env.storage_mount && fs.existsSync(process.env.storage_mount)
        ? process.env.storage_mount
        : ".";

    let dir;

    // Check the file type and set the directory accordingly
    if (file.mimetype.startsWith("image/")) {
      dir = `${storagePath}/uploads/images/`;
    } else if (file.mimetype.startsWith("application/")) {
      dir = `${storagePath}/uploads/documents/`;
    } else {
      dir = `${storagePath}/uploads/others/`; // Default directory for other file types
    }

    // Create the directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + extension);
  },
});

let upload = multer({
  storage: storage,
});

/**
 * @swagger
 * /web/favicon_generator:
 *   post:
 *     summary: Generate Favicon
 *     tags: [Web Tools]
 *     parameters:
 *       - in: query
 *         name: only16
 *         description: Should only be 16x16 file
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *            - "true"
 *            - "false"
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               inputImg:
 *                 type: string
 *                 format: binary
 *                 required: true
 *                 description: Image file for generating favicon
 *     responses:
 *       '200':
 *         description: Favicon generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                   example: true
 *                 zipPath:
 *                   type: string
 *                   description: Generated zip file location
 *                   example: http://localhost:5000/generated_favicons/1700733925667.zip
 *       '400':
 *         description: Bad request, validation error or missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 reason:
 *                   type: string
 */
router.post("/favicon_generator", upload.single("inputImg"), generateFavicon);

/**
 * @swagger
 * /web/pdf-converter:
 *   post:
 *     summary: Convert PDF
 *     tags: [Web Tools]
 *     parameters:
 *       - in: query
 *         name: target
 *         description: Target file format, default docx
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *            - "docx"
 *            - "pptx"
 *            - "tex"
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               inputFile:
 *                 type: string
 *                 format: binary
 *                 required: true
 *                 description: Source pdf file
 *     responses:
 *       '200':
 *         description: Converted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                   example: true
 *                 targetFilePath:
 *                   type: string
 *                   description: Generated File location
 *                   example: http://localhost:5000/converted_files/1700733925667.zip
 *       '400':
 *         description: Bad request, validation error or missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 reason:
 *                   type: string
 */

router.post(
  "/pdf-converter",
  validateToken,
  (req, res, next) => {
    req.toolId = "pdf_converter";
    next();
  },
  trackUsage,
  upload.single("inputFile"),
  convertPdf,
  incrementUsage
);

/**
 * @swagger
 * /web/image-compressor:
 *   post:
 *     summary: Compress Image
 *     tags: [Web Tools]
 *     parameters:
 *       - in: query
 *         name: width
 *         description: Width of the output image
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: height
 *         description: Height of the output image
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: quality
 *         description: Quality of the output image (0-100)
 *         required: false
 *         schema:
 *           type: integer
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image_file:
 *                 type: string
 *                 format: binary
 *                 required: true
 *                 description: Image file to compress
 *     responses:
 *       '200':
 *         description: Image compressed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                   example: true
 *                 targetFilePath:
 *                   type: string
 *                   description: Generated File location
 *                   example: http://localhost:5000/converted_files/1700733925667.zip
 */
router.post("/image-compressor", upload.single("image_file"), compressImage);

module.exports.webTools = router;

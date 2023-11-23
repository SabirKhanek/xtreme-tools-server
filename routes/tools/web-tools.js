const { Router } = require("express");
const router = Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { generateFavicon } = require("../../controllers/web");
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const storage =
      process.env.storage_mount && fs.existsSync(process.env.storage_mount)
        ? process.env.storage_mount
        : ".";
    const dir = storage + "/uploads/images/";
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

module.exports.webTools = router;

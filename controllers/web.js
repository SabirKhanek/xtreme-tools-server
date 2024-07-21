/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */

const { WebTools } = require("../services/web_tools");
const config = require("../environments/config");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const fetch = require("node-fetch");
const sharp = require("sharp");
const mime = require("mime-types");
const service = new WebTools();
/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
async function generateFavicon(req, res, next) {
  try {
    if (!req.file)
      return res
        .status(400)
        .send({ success: false, reason: "No image provided" });
    const is16x16 = req.query.only16 === "true";
    const fileName = `${new Date().getTime()}.${is16x16 ? "ico" : "zip"}`;
    await service.generateFavicons(
      req.file.path,
      `public/generated_favicons/${fileName}`,
      is16x16
    );
    res.send({
      success: true,
      zipPath: `${config.HOST}/generated_favicons/${fileName}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, err });
  }
}
/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
async function convertPdf(req, res, next) {
  try {
    if (!req.file)
      return res
        .status(400)
        .send({ success: false, reason: "No document provided" });

    if (!fs.existsSync(req.file.path)) {
      return res
        .status(400)
        .send({ success: false, reason: "File does not exist" });
    }

    const stats = fs.statSync(req.file.path);
    if (stats.size === 0) {
      return res.status(400).send({ success: false, reason: "File is empty" });
    }
    // var inputFile = Buffer.from(fs.readFileSync(req.file.path).buffer);
    const inputFile = req.file.path;
    const fileName = `${new Date().getTime()}.docx`;
    const resultFilePath = "public/result_files/" + fileName;
    await convertPdfToDocx(inputFile, resultFilePath);
    res.send({
      success: true,
      downloadPath: `${config.HOST}/result_files/${fileName}`,
    });
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, err });
  }
}

/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
async function compressImage(req, res, next) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .send({ success: false, reason: "No image file provided" });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const mimeType = mime.lookup(fileExtension);
    const fileName = `${new Date().getTime()}.${fileExtension.replace(
      ".",
      ""
    )}`;
    const outputPath = `public/compressed_images/${fileName}`;

    // Set default values for width, height, and quality
    const width = parseInt(req.query.width) || null; // Allow null to maintain aspect ratio
    const height = parseInt(req.query.height) || null; // Allow null to maintain aspect ratio
    const quality = parseInt(req.query.quality) || 80; // Default quality

    // Validate quality
    if (quality < 0 || quality > 100) {
      return res
        .status(400)
        .send({ success: false, reason: "Quality must be between 0 and 100" });
    }

    // Get input file size
    const inputSize = fs.statSync(filePath).size;

    // Compress the image using sharp
    const transformer = sharp(filePath);

    if (width || height) {
      transformer.resize(width, height); // Resize image
    }

    if (mimeType) {
      switch (mimeType) {
        case "image/jpeg":
          transformer.jpeg({ quality });
          break;
        case "image/png":
          transformer.png({ quality: Math.round((quality / 100) * 9) }); // PNG quality is 0-9
          break;
        case "image/webp":
          transformer.webp({ quality });
          break;
        default:
          return res
            .status(400)
            .send({ success: false, reason: "Unsupported image format" });
      }
    }

    ensureDirectoryExistence(path.join(process.cwd(), outputPath));

    // Output the compressed image
    await transformer.toFile(path.join(process.cwd(), outputPath));

    // Get output file size
    const outputSize = fs.statSync(path.join(process.cwd(), outputPath)).size;

    // Calculate size difference
    const sizeDifference = inputSize - outputSize;

    // Optionally, clean up the temporary file
    fs.unlinkSync(filePath);

    // Send response
    res.send({
      success: true,
      downloadPath: `${config.HOST}/compressed_images/${fileName}`,
      inputSize: inputSize,
      outputSize: outputSize,
      sizeDifference: sizeDifference,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, err });
  }
}
async function convertPdfToDocx(inputPath, outPath) {
  console.log(fs.statSync(path.join(process.cwd(), inputPath)));
  const form = new FormData();
  form.append(
    "inputFile",
    fs.createReadStream(path.join(process.cwd(), inputPath))
  );
  console.log(path.join(process.cwd(), inputPath));
  const response = await fetch(
    "https://api.cloudmersive.com/convert/pdf/to/docx",
    {
      method: "POST",
      headers: {
        Apikey: config.CLOUDMERSIVE,
        ...form.getHeaders(),
      },
      body: form,
    }
  );

  if (!response.ok) {
    let message = response.statusText;
    try {
      message = await response.text();
    } catch (err) {}
    throw new Error(`${message}`);
  }

  const buffer = await response.buffer();
  ensureDirectoryExistence(outPath);
  fs.writeFileSync(path.join(process.cwd(), outPath), buffer);
}

function ensureDirectoryExistence(filePath) {
  const dirName = path.dirname(filePath);
  if (fs.existsSync(dirName)) {
    return true;
  }
  ensureDirectoryExistence(dirName);
  fs.mkdirSync(dirName);
}

module.exports = { generateFavicon, convertPdf, compressImage };

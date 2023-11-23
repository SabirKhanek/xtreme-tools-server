/**
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */

const { WebTools } = require("../services/web_tools");
const config = require("../environments/config");

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

    const zipName = `${new Date().getTime()}.zip`;
    await service.generateFavicons(
      req.file.path,
      `public/generated_favicons/${zipName}`
    );
    res.send({
      success: true,
      zipPath: `${config.HOST}/generated_favicons/${zipName}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, err });
  }
}

module.exports = { generateFavicon };

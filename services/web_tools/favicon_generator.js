const fs = require("fs").promises;
const sharp = require("sharp");
const Jimp = require("jimp");
const pngToIco = require("png-to-ico");
const AdmZip = require("adm-zip");

class FaviconGenerator {
  async resizeImage(inputImagePath, outputImagePath, width, height) {
    try {
      await sharp(inputImagePath).resize(width, height).toFile(outputImagePath);
    } catch (error) {
      throw new Error(`Error resizing image: ${error.message}`);
    }
  }

  async convertToIco(pngPath, outputIcoPath) {
    try {
      const icoBuff = await pngToIco(pngPath, outputIcoPath);
      await fs.writeFile(outputIcoPath, icoBuff);
    } catch (error) {
      throw new Error(`Error converting to ICO: ${error.message}`);
    }
  }

  async createZip(inputImagePath, outputZipPath) {
    const zip = new AdmZip();
    try {
      // Add original image to the zip
      await zip.addLocalFile(inputImagePath, false, "original_image.png");
      const tempDir = `./temp-${new Date().getTime()}`;
      await fs.mkdir(tempDir);
      // Add icons to the zip
      const iconSizes = [16, 32, 64, 128, 256, 512];
      for (const size of iconSizes) {
        const iconPath = tempDir + "/" + `icon@${size}x${size}.ico`;
        const resizedPngPath = tempDir + "/" + `icon@${size}x${size}.png`;
        await this.resizeImage(inputImagePath, resizedPngPath, size, size);
        await this.convertToIco(resizedPngPath, iconPath);
        zip.addLocalFile(iconPath, false, `icon@${size}x${size}.ico`);
        zip.addLocalFile(resizedPngPath, false, `icon@${size}x${size}.png`);
      }

      await fs.mkdir(
        outputZipPath.substring(0, outputZipPath.lastIndexOf("/")),
        { recursive: true }
      );
      // Write the zip file
      zip.writeZip(outputZipPath);
      try {
        await fs.rm(tempDir, { recursive: true });
      } catch (err) {
        console.log(err);
      }
      return outputZipPath;
    } catch (error) {
      console.log(error);
      throw new Error({
        success: false,
        reason: `Error creating zip file: ${error.message}`,
      });
    }
  }
}

module.exports = { FaviconGenerator };

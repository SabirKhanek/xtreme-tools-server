const { FaviconGenerator } = require("./favicon_generator");

class WebTools {
  constructor() {
    this.faviconGenerator = new FaviconGenerator();
  }

  async generateFavicons(inputImagePath, outputZipPath, is16x16) {
    try {
      if (is16x16)
        return await this.faviconGenerator.create16x16(
          inputImagePath,
          outputZipPath
        );
      return await this.faviconGenerator.createZip(
        inputImagePath,
        outputZipPath
      );
    } catch (error) {
      console.log(error);
      throw new Error({ success: false, reason: error });
    }
  }
}

module.exports = { WebTools };

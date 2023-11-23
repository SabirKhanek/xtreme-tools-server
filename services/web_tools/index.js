const { FaviconGenerator } = require("./favicon_generator");

class WebTools {
  constructor() {
    this.faviconGenerator = new FaviconGenerator();
  }

  async generateFavicons(inputImagePath, outputZipPath) {
    try {
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

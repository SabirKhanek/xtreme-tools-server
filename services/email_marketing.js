const nodemailer = require("nodemailer");

class EmailMarketingService {
  /**
   * Represents a configuration object for an email transport.
   * @typedef {Object} EmailTransportConfig
   * @property {string} host - The host of the email server.
   * @property {number} port - The port of the email server.
   * @property {boolean} [secure] - Indicates whether the connection is secure.
   * @property {string} from - The sender's email address.
   * @property {string} to - The recipient's email address.
   * @property {Object} [auth] - Authentication information.
   * @property {string} [auth.user] - The username for authentication.
   * @property {string} [auth.pass] - The password for authentication.
   */
  /**
   * @param {EmailTransportConfig} config
   */
  async testSMTP(config) {
    try {
      const transport = nodemailer.createTransport({ ...config });
      await transport.sendMail({
        text: "Testing SMTP server. Test Powered by xtreme-tools.",
        to: config.to,
        from: config.from,
      });
      return { success: true };
    } catch (err) {
      return { success: false, reason: err };
    }
  }
}
module.exports = { EmailMarketingService };

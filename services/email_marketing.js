const nodemailer = require("nodemailer");
const { ErrorWithStatus } = require("../utils/error");
const { axios } = require("../utils/axios/axios");

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

  /**
   * @param {string} domain 
   */
  async emailChecker(domain) {
    return {
      valid: true,
      block: true,
      disposable: true,
      domain: "mailinator.com",
      text: "Disposable e-mail",
      reason: "Blacklist",
      mx_host: "mail2.mailinator.com",
      possible_typo: [],
      mx_info:
        "Using MX pointer mail2.mailinator.com from DNS with priority: 1",
      mx_ip: "45.33.83.75",
    };
  }

  /**
   * @param {string} domain
   */
  async RapidEmailChecker(domain) {
    const url = "https://mailcheck.p.rapidapi.com/";

    try {
      const response = await axios.get(url, {
        params: { domain },
        headers: {
          ...axios.defaults.headers,
          "X-RapidAPI-Host": "mailcheck.p.rapidapi.com",
        },
      });
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.log(err);
      throw new ErrorWithStatus(
        "Something went wrong. Possibly couldn't communicate to Email Check service",
        500
      );
    }
  }
}
module.exports = { EmailMarketingService };

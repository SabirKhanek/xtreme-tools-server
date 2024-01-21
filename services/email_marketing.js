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
      email: "email@email.com",
      code: "6",
      role: true,
      free_email: true,
      result: "Invalid",
      reason: "Bounce, Role",
      send_transactional: 0,
      did_you_mean: "",
    };
  }

  /**
   * @param {string} domain
   */
  async RapidEmailChecker(domain) {
    const url =
      "https://email-validation24.p.rapidapi.com/email/validate-email";

    try {
      const response = await axios.get(url, {
        params: { user_input_email: domain },
        headers: {
          ...axios.defaults.headers,
          "X-RapidAPI-Host": "email-validation24.p.rapidapi.com",
        },
      });
      if (response.data.result?.validation)
        return response.data.result.validation;
      else
        throw new ErrorWithStatus(
          response.data.message || "Service didn't responded as expected",
          500
        );
    } catch (err) {
      console.log(err);
      throw new ErrorWithStatus(
        err.message ||
          "Something went wrong. Possibly couldn't communicate to service",
        err.statusCode || 500
      );
    }
  }
}
module.exports = { EmailMarketingService };

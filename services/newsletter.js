const { ErrorWithStatus } = require("../utils/error");
const { mailchimp } = require("../utils/mailchimp");

class NewletterService {
  async registerEmail(email) {
    try {
      await mailchimp.lists.addListMember("0292244051", {
        email_address: email,
        status: "subscribed",
      });
    } catch (err) {
      throw new ErrorWithStatus(
        err.response?.body?.title ||
          "Unknown error while communicating with mailchimp",
        err.response?.body?.status || 500
      );
    }
  }
}

module.exports = { NewletterService };

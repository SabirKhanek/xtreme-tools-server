const { NewsletterSubscriber } = require("../db/sequelize");
const { ErrorWithStatus } = require("../utils/error");
const { sendMail } = require("../utils/nodemailer/controllers/sendMail");
const pug = require("pug");

class NewletterService {
  async registerEmail(email) {
    const mail = await NewsletterSubscriber.findByPk(email);
    if (mail) {
      throw new ErrorWithStatus(
        "You are already subscribed to newsletter",
        400
      );
    } else {
      const compileFunction = pug.compileFile(
        "./templates/subscribe_to_newsletter.pug"
      );
      await sendMail(
        email,
        "Newsletter Subsription Confirmation | Xtreme Tools",
        compileFunction()
      );
      return await NewsletterSubscriber.create({ email });
    }
  }
}

module.exports = { NewletterService };

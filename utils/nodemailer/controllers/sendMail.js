const { SYSTEM_GMAIL } = require("../../../environments/config");
const { establishMailTransporterWithRetry } = require("../nodeMailerConfig");
module.exports.sendMail = async (to, subject, html) => {
  try {
    /**
     * @typedef {import('nodemailer').SendMailOptions}
     */
    const mailOptions = {
      from: SYSTEM_GMAIL,
      to,
      subject,
      html,
    };

    const transporter = await establishMailTransporterWithRetry();
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new Error(err);
  }
};

const mailchimp = require("@mailchimp/mailchimp_marketing");
const { MAILCHIMP_KEY } = require("../environments/config");
mailchimp.setConfig({
  apiKey: MAILCHIMP_KEY,
  server: "us11",
});
module.exports.mailchimp = mailchimp;

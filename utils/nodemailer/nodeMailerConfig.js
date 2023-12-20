const nodemailer = require("nodemailer");
const config = require("../../environments/config");

const createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    host: "mail.xtreme.tools",
    port: 465,
    secure: true, 
    auth: {
      user: config.SYSTEM_GMAIL,
      pass: config.SYSTEM_PASSWORD, 
    },
  });
  try {
    await transporter.verify();
    return transporter; 
  } catch (err) {
    console.error("Node Mailer connection failed:", err.message);
    return null; 
  }
};


const establishMailTransporterWithRetry = async () => {
  let transporter = null;
  let retries = 3; 

  while (retries > 0 && !transporter) {
    transporter = await createTransporter();
    if (!transporter) {
      console.log(`Retrying in 5 seconds... (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, 5000)); 
      retries--;
    }
  }

  if (!transporter) {
    console.error(
      "Max retries reached. Unable to establish Node Mailer connection."
    );
  }

  return transporter;
};

// Usage
const main = async () => {
  const mailTransporter = await createTransporter();
  if (mailTransporter) {
    console.log("Node mailer is configured.");
  } else {
    console.error("Unable to establish a working Node Mailer connection.");
  }
};

main();

module.exports.establishMailTransporterWithRetry =
  establishMailTransporterWithRetry;

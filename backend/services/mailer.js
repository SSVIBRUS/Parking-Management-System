const nodemailer = require('nodemailer');
const { outbox } = require('../data/parkingData');

// Create test or SMTP transporter
let transporter = null;

async function initMailer() {
  try {
    // Generate test SMTP service (Ethereal Mail) for instant verification
    let testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log("Nodemailer initialised with test account:", testAccount.user);
  } catch (err) {
    console.log("Nodemailer test transport fallback mode active.");
  }
}

initMailer();

async function sendEmailNotification({ to, subject, htmlContent, textContent, emailType = "LOGIN_NOTIFICATION" }) {
  const mailRecord = {
    id: `MAIL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    to,
    subject,
    html: htmlContent,
    text: textContent,
    type: emailType,
    sentAt: new Date().toISOString(),
    status: "DELIVERED"
  };

  // 1. Log into in-memory live outbox store
  outbox.unshift(mailRecord);

  // 2. Dispatch via Nodemailer if active
  if (transporter) {
    try {
      let info = await transporter.sendMail({
        from: '"Campus Smart Parking System" <no-reply@college-parking.edu>',
        to: to,
        subject: subject,
        text: textContent,
        html: htmlContent
      });
      console.log("Email dispatched to %s. MessageId: %s", to, info.messageId);
      mailRecord.previewUrl = nodemailer.getTestMessageUrl(info);
    } catch (err) {
      console.error("Nodemailer send error:", err.message);
    }
  }

  return mailRecord;
}

module.exports = {
  sendEmailNotification
};

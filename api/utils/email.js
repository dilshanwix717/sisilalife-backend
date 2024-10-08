var nodemailer = require("nodemailer");
var dotenv = require("dotenv");
dotenv.config();

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.SYSTEM_SERVICE_PROVIDER_EMAIL,
    pass: process.env.SYSTEM_SERVICE_PROVIDER_EMAIL_PASSWORD,
  },
});
// const transporter = undefined;

const sendInquiryReplyEmail = async (userEmail, inquieryMessage, reply) => {
  try {
    const mailOptions = {
      from: "your_email@example.com",
      to: userEmail,
      subject: "No-Reply",
      html: `
            <div style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333; margin-top: 20px; text-align: center;"></h2>
                <p style="color: #666; font-size: 16px;">Message: ${inquieryMessage}</strong></p>
                <p style="color: #666; font-size: 16px;">Reply ${reply}</p>
              </div>
            </div>
          `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendInquiryReplyEmail };

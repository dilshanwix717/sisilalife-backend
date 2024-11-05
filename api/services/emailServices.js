const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to, subject, html, body) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.APP_PASSWORD,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: html,
        body: body // html body
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        return { success: true, info: info };
    } catch (error) {
        return { success: false, error: error };
    }
};

module.exports = {
    sendEmail,
};

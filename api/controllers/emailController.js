const emailService = require('../services/emailServices');

class EmailController {
    // Sends the subscription confirmation email
    async sendSubscriptionConfirmationEmail(to, displayName, planType, startDate, endDate, amount, currency) {
        const subject = 'Subscription Confirmation';
        const html = `
            <p>Dear ${displayName || 'Subscriber'},</p>
            <p>Thank you for subscribing to our service!</p>
            <h3>Subscription Details:</h3>
            <p><strong>Plan:</strong> ${planType}</p>
            <p><strong>Start Date:</strong> ${startDate}</p>
            <p><strong>End Date:</strong> ${endDate}</p>
            <p><strong>Payment Amount:</strong> ${amount} ${currency}</p>
            <p>Your subscription is now active. Enjoy our services!</p>
            <p>Best regards,<br>Your Company Team</p>
        `;

        return await emailService.sendEmail(to, subject, html, '');
    }

    // Sends the subscription cancellation confirmation email
    async sendSubscriptionCancellationEmail(to, displayName, planType, endDate) {
        const subject = 'Subscription Cancellation Confirmation';
        const html = `
            <p>Dear ${displayName || 'Subscriber'},</p>
            <p>We are sorry to see you go!</p>
            <h3>Subscription Cancellation Details:</h3>
            <p><strong>Plan:</strong> ${planType}</p>
            <p><strong>End Date:</strong> ${endDate}</p>
            <p>Your subscription has been set to cancel at the end of your billing period. You will retain access until the end date listed above.</p>
            <p>If you have any questions or would like to resubscribe, please feel free to reach out to our support team.</p>
            <p>Best regards,<br>Your Company Team</p>
        `;

        return await emailService.sendEmail(to, subject, html, '');
    }
}

module.exports = new EmailController();

const { sendEmail } = require("../config/mailer");

class EmailService {
    static async sendVerificationEmail(user, otp) {
        const { email, firstName, lastName } = user;
        const subject = "Verify Your TaskFlow Account";
        const text = `
Hello ${firstName} ${lastName},
Welcome to TaskFlow!
Your email verification code is: ${otp}
This code expires in 20 minutes.
If you did not create this account, please ignore this email.
`;

        const html = `
            <h2>Welcome to TaskFlow!</h2>
            <p>Hello ${firstName} ${lastName},</p>
            <p>Thank you for registering.</p>
            <p>Your email verification code is:</p>
            <h1>${otp}</h1>
            <p>This code expires in 20 minutes.</p>
            <p>If you did not create this account, please ignore this email.</p>
        `;

        return await sendEmail(email, subject, text, html);
    }

    static async sendPasswordResetEmail(user, otp) {
        const { email, firstName, lastName } = user;
        const subject = "TaskFlow Password Reset";
        const text = `
Hello ${firstName} ${lastName},
Welcome to TaskFlow!
Your password reset verification code is: ${otp}
This code expires in 20 minutes.
If you did not create this account, please ignore this email.
`;

        const html = `
            <h2>Password Reset</h2>
            <p>Hello ${firstName} ${lastName},</p>
            <p>Your password reset code is:</p>
            <h1>${otp}</h1>
            <p>This code expires in 20 minutes.</p>
        `;

        return await sendEmail(email, subject, text, html);
    }
}

module.exports = EmailService;

const { User } = require("../models");
const EmailService = require("../service/email.service");
const OtpService = require("../utilis/otp");

class UserController {
    static async userRegistration(req, res) {
        try {
            const { firstName, lastName, email, password, gender } = req.body;

            // Validate required fields
            if (
                !firstName ||
                !lastName ||
                !email ||
                !password
            ) {
                return res.status(400).json({
                    success: false,
                    message: "First name, last name, email and password are required"
                });
            }

            if (password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 8 characters"
                });
            }

            // Normalize email
            const normalizedEmail = email.trim().toLowerCase();

            // Check if email already exists
            const existingEmail = await User.findOne({
                where: { email: normalizedEmail }
            });

            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists"
                });
            }

            // Create user
            const user = await User.create({
                firstName,
                lastName,
                email: normalizedEmail,
                password,
                gender
            });
            const otp = await OtpService.generateOTP(user.id, "email_verification");
            
            // 6. Send OTP to user's email
            await EmailService.sendVerificationEmail(user, otp)

            return res.status(201).json({
                success: true,
                message: "User account created successfully",
                data: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    gender: user.gender,
                    status: user.status
                }
            });

        } catch (error) {
            console.error("Registration error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Unable to complete registration. Please try again."
            });
        }
    }

    static async verifyEmail(req, res) {
        try {
            const { email, code } = req.body;
            if (
                !email ||
                !code

            ) {
                return res.status(400).json({
                    message: "Email and verification code are required",
                    success: false
                })
            }

            const normalizedEmail = email.trim().toLowerCase();

            const user = await User.findOne({ where: { email: normalizedEmail } })
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                    success: false
                })
            };

            if (user.status === "active") {
                return res.status(200).json({
                    success: true,
                    message: "Email has already been verified"
                })
            }

            const verification = await OtpService.verifyOTP(user.id, code, "email_verification")
            if (!verification.success) {
                return res.status(400).json({
                    success: false,
                    message: verification.message
                });
            }

            await user.update({
                status: "active"
            })

            return res.status(200).json({
                success: true,
                message: "Email verified successfully. Your account is now active."
            });

        } catch (error) {
            console.error("Email verification error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}

module.exports = UserController;
const { Otp } = require("../models");
const otpGenerator = require("otp-generator");

class OtpService {
    static async generateOTP(userId, purpose) {
        try {
            const otp = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });

            // Invalidate previous unused OTPs for this purpose.
            await Otp.update(
                {
                    usedAt: new Date()
                },
                {
                    where: {
                        userId,
                        purpose,
                        usedAt: null
                    }
                }
            );

            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            await Otp.create({
                userId,
                codeHash: otp,
                purpose,
                expiresAt
            });

            return otp;
        } catch (error) {
            console.error("OTP generation failed:", error.message);
            throw error;
        }
    }

    static async verifyOTP(userId, code, purpose) {
        if (!/^\d{6}$/.test(String(code))) {
            return {
                success: false,
                message: "Please enter a valid six-digit OTP"
            };
        }
        try {
            const otpRecord = await Otp.findOne({
                where: {
                    userId,
                    purpose,
                    usedAt: null
                },
                order: [["createdAt", "DESC"]]
            });

            if (!otpRecord) {
                return {
                    success: false,
                    message: "Invalid or expired OTP"
                };
            }

            if (new Date() > new Date(otpRecord.expiresAt)) {
                await otpRecord.update({
                    usedAt: new Date()
                });

                return {
                    success: false,
                    message: "OTP has expired"
                };
            }

            const isValid = await otpRecord.validateCode(code);

            if (!isValid) {
                return {
                    success: false,
                    message: "Invalid or expired OTP"
                };
            }

            await otpRecord.update({
                usedAt: new Date()
            });

            return {
                success: true,
                message: "OTP verified successfully"
            };
            
        } catch (error) {
            console.error("OTP verification failed:", error.message);
            throw error;
        }
    }
}

module.exports = OtpService;
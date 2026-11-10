const { User } = require("../models")
const jwt = require("jsonwebtoken")
const jwtConfig = require("../config/jwt.config")


class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body
            if (!password || !email) {
                return res.status(400).json({ message: "Email and Password is required" })
            }

            const normalizedEmail = email.trim().toLowerCase();
            // find user
            const user = await User.findOne({
                where: { email: normalizedEmail }
            })

            if (!user) return res.status(400).json({ message: "Email not found" })

            if (user.status !== "active") {
                return res.status(401).json({
                    message: "Please verify your email before logging",
                    success: false
                })
            }

            const ismatch = await user.validatePassword(password);
            if (!ismatch) {
                return res.status(401).json({
                    message: "Invalid email or password please recheck",
                    success: false
                })
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email
                },
                jwtConfig.secret,
                {
                    expiresIn: jwtConfig.expiresIn
                }
            );

            const userJson = user.toJSON();
            delete userJson.password // setting user password to null in response ;//setting user passoword to null in response

            return res.status(200).json({
                message: "Login successfully",
                data: {
                    user: userJson,
                    token
                },
                success: true
            })
        } catch (error) {
            console.error("Login error:", error.message);
            return res.status(500).json({
                message: "Internal server error",
                success: false,
                error: error.message
            })
        }
    }
}

module.exports = AuthController 
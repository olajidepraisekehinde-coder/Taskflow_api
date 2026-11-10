require("dotenv").config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured in .env");
}

module.exports = {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "20m"
};
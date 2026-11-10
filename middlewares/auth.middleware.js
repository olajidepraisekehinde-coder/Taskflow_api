// For u to authenticate and authorize the user we need to create middleware
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.config");
const { User } = require("../models");

// authenticate middleware
// verifies jwt token from authetication header and attaches authenticated user to req.user
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "unauthorized, Authentication token is not found"
            })
        }
        // split token from header      
        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            // jwt.verify(token, jwtConfig.secret)
            decoded = jwt.verify(token, jwtConfig.secret);

            // jwt.verify() Checks whether the token's signature is valid.
            // Checks whether the token has expired.
            
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                error.statusCode = 401;
                error.message = "Token Expired , please login again"
                throw error
            } else {
                error.statusCode = 403;
                error.message = "Invalid authentication token"
                throw error
            }
        }

        const user = await User.findByPk(decoded.id);

        if (!user || user.status !== "active") {
            return res.status(401).json({ message: "unathorized, Invalid or inactive user" })
        }
        req.user = user;
        next();

    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            error
        })
    }
}


// const authorize = (...roles) => {

//     return (req, res, next) => {
//         if (!req.user) {
//             return res.status(401).json({
//                 message: "Unauthorized access"
//             })
//         }
//         if (!roles.includes(req.user.role)) {
//             return res.status(403).json({
//                 message: `Unauthorized to access this resource. Required [${roles.join(", ")}] your current role [${req.user.role}]`
//             })
//         }
//         next();
//     }
// }
module.exports = { authenticate }
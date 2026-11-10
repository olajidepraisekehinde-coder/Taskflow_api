const express = require("express")
const router = express.Router()
const UserController = require("../controllers/user.controller")

router.post("/register", UserController.userRegistration);
router.post("/verify-email", UserController.verifyEmail)


module.exports = router
const express = require("express");
const router = express()
const AuthController = require("../controllers/auth.controller")

router.post("/login", AuthController.login)

module.exports = router
const express = require("express");

const authController = require("../controllers/auth");
const userValidator = require("../validators/user");

const router = express.Router();

router.put("/signup", userValidator.signup, authController.signup);

router.post("/login", userValidator.login, authController.login);

module.exports = router;

const { body } = require("express-validator");

const User = require("../models/user");

exports.signup = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email!")
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          const error = new Error("A user already exists with the email!");
          error.statusCode = 422;
          throw error;
        }
      } catch (err) {
        return Promise.reject(err.message || "Some Error has occured");
      }
    }),
  body("name").trim().isString().withMessage("Please enter a valid name!"),
];

exports.login = [
  body("email").isEmail().withMessage("Please enter a valid email!"),
];

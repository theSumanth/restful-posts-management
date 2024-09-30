const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const KEYS = require("../keys");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Could not validate user!");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email: email,
      password: hashedPassword,
      name: name,
      posts: [],
    });
    const newUserDoc = await newUser.save();
    res
      .status(201)
      .json({ message: "User signup successful", user: newUserDoc });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const loadedUser = await User.findOne({ email: email });
    if (!loadedUser) {
      const error = new Error("No user found for this email!");
      error.statusCode = 422;
      throw error;
    }

    const isPasswordEqual = await bcrypt.compare(password, loadedUser.password);
    if (!isPasswordEqual) {
      const error = new Error("Invalid password!");
      error.statusCode = 422;
      throw error;
    }
    const token = jwt.sign(
      { email: loadedUser.email, userId: loadedUser._id.toString() },
      KEYS.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "User log in successful!",
      token: token,
      userId: loadedUser._id.toString(),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

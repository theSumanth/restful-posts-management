const { body } = require("express-validator");

exports.newAndEditPost = [
  body("title").trim().isLength({ min: 5 }).withMessage("Not a valid title."),
  body("content")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Not a valid content text"),
];

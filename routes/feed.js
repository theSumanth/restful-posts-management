const express = require("express");

const feedController = require("../controllers/feed");

const postValidator = require("../validators/post");

const router = express.Router();

router.get("/posts", feedController.getPosts);

router.post("/post", postValidator.newAndEditPost, feedController.createPost);

router.get("/post/:postId", feedController.getPost);

module.exports = router;

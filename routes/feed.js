const express = require("express");

const feedController = require("../controllers/feed");

const postValidator = require("../validators/post");

const router = express.Router();

router.get("/posts", feedController.getPosts);

router.post("/post", postValidator.newAndEditPost, feedController.createPost);

router.get("/post/:postId", feedController.getPost);

router.put(
  "/post/:postId",
  postValidator.newAndEditPost,
  feedController.updatePost
);

router.delete("/post/:postId", feedController.deletePost);

module.exports = router;

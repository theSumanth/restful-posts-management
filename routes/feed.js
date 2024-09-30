const express = require("express");

const feedController = require("../controllers/feed");
const isAuth = require("../middlewares/is-auth");

const postValidator = require("../validators/post");

const router = express.Router();

router.get("/posts", isAuth, feedController.getPosts);

router.post(
  "/post",
  isAuth,
  postValidator.newAndEditPost,
  feedController.createPost
);

router.get("/post/:postId", isAuth, feedController.getPost);

router.put(
  "/post/:postId",
  isAuth,
  postValidator.newAndEditPost,
  feedController.updatePost
);

router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;

const Post = require("../models/post");

const { validationResult } = require("express-validator");

const fileUtility = require("../util/file");

exports.getPosts = async (req, res, next) => {
  try {
    const totalPostsCount = await Post.countDocuments();
    const posts = await Post.find();
    res.status(200).json({
      message: "Successfully retrieved posts",
      posts: posts,
      totalItems: totalPostsCount,
    });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty() || !req.file) {
    const error = new Error("Validation failed! Enter the valid data.");
    error.statusCode = 422;
    return next(error);
  }

  const title = req.body.title;
  const content = req.body.content;
  const image = req.file;
  const imageUrl = image.path.replace("\\", "/");
  try {
    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: { name: "sumanth" },
    });

    await post.save();
    res.status(201).json({
      message: "Successfully created a post!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find the post!");
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({ message: "Successfully retreived the post", post: post });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validaion failed! Enter the valid data");
    error.statusCode = 422;
    return next(error);
  }

  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    console.log(imageUrl);
    imageUrl = req.file.path.replace("\\", "/");
    console.log(imageUrl);
  }
  if (!imageUrl) {
    const error = new Error("Validaion failed! Enter the valid data");
    error.statusCode = 422;
    return next(error);
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Couldn't find the post!");
      error.statusCode = 404;
      return next(error);
    }
    if (post.imageUrl !== imageUrl) {
      fileUtility.deleteFile(post.imageUrl);
    }
    post.title = updatedTitle;
    post.content = updatedContent;
    post.imageUrl = imageUrl;
    await post.save();
    res.status(200).json({ message: "Post updated!", post: post });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could'nt find the post.");
      error.statusCode = 404;
      next(err);
    }
    //post belongs to user??

    fileUtility.deleteFile(post.imageUrl);
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Deletion of post successful" });
  } catch (err) {
    next(err);
  }
};

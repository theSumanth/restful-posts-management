const Post = require("../models/post");
const User = require("../models/user");

const { validationResult } = require("express-validator");

const fileUtility = require("../util/file");

exports.getPosts = async (req, res, next) => {
  const ITEMS_PER_PAGE = 2;
  try {
    const page = req.query.page || 1;
    const totalPostsCount = await Post.countDocuments();
    const posts = await Post.find()
      .populate({
        path: "creator",
        select: "_id name",
      })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.status(200).json({
      message: "Successfully retrieved posts",
      posts: posts,
      totalItems: totalPostsCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty() || !req.file) {
      const error = new Error("Validation failed! Enter the valid data.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    const image = req.file;
    const imageUrl = image.path.replace("\\", "/");
    const userId = req.userId;
    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: userId,
    });

    const postDoc = await post.save();
    const user = await User.findById(userId);
    user.posts.push(post);
    await user.save();
    res.status(201).json({
      message: "Successfully created a post!",
      post: postDoc,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate({
      path: "creator",
      select: "_id name",
    });
    if (!post) {
      const error = new Error("Could not find the post!");
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({ message: "Successfully retreived the post", post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validaion failed! Enter the valid data");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
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
      throw error;
    }

    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Couldn't find the post!");
      error.statusCode = 404;
      throw error;
    }
    if (post.imageUrl !== imageUrl) {
      fileUtility.deleteFile(post.imageUrl);
    }
    post.title = updatedTitle;
    post.content = updatedContent;
    post.imageUrl = imageUrl;
    const postDoc = await post.save();
    res.status(200).json({ message: "Post updated!", post: postDoc });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Couldn't find the post.");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId.toString()) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }

    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();

    fileUtility.deleteFile(post.imageUrl);
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Deletion of post successful" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

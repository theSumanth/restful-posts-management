exports.getPosts = (req, res, next) => {
  res.status(200).json({ message: "Successfully retrieved posts" });
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  res
    .status(201)
    .json({ message: "Created post!", title: title, content: content });
};

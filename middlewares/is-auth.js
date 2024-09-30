const jwt = require("jsonwebtoken");

const KEYS = require("../keys");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated!");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, KEYS.JWT_SECRET_KEY);
  } catch (err) {
    err.statusCode = 500;
    return next(err);
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated!");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};

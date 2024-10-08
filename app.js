const path = require("path");

const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const KEYS = require("./keys");
const { appDir } = require("./util/file");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const name = uuidv4() + "." + file.originalname.split(".").reverse()[0];
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = ["image/png", "image/jpg", "image/jpeg"];

  if (fileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(appDir, "images")));

app.use("/auth", authRoutes);
app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  return res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(KEYS.MONGODB_CONNECTION_URI)
  .then(() => {
    console.log("connected to the database");
    app.listen(KEYS.PORT, () => {
      console.log(`listening to port ${KEYS.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

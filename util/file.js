const fs = require("fs");
const path = require("path");

const appDir = path.dirname(require.main.filename);

const deleteFile = (filePath) => {
  const p = path.join(appDir, filePath);
  fs.unlink(p, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

exports.appDir = appDir;
exports.deleteFile = deleteFile;

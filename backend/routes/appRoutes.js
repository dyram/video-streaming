module.exports = app => {
  const multer = require("multer");

  const Videos = require("../controllers/videoController");

  let Storage = multer.diskStorage({
    destination: "../public/videos",
    filename: function(req, file, callback) {
      callback(
        null,
        file.fieldname + "_" + Date.now() + "_" + file.originalname + ".webm"
      );
    }
  });

  var upload = multer({
    storage: Storage
  }).single("file");

  app.get("/", (req, res) => {
    res.send("Working Fine!!");
  });

  app.post("/uploadMovie", upload, async (req, res) => {
    let resp = await Videos.addVideo(req.file.filename, req.file.path);
    res.send(resp);
  });
};

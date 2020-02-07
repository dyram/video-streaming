const model = require("../models");
const Video = model.Video;

Videos = () => {};

Videos.addVideo = async (name, path) => {
  let promise = await Video.create({
    name: name,
    path: path
  });
  return promise;
};

module.exports = Videos;

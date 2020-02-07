"use strict";
module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define(
    "Video",
    {
      name: DataTypes.STRING,
      path: DataTypes.STRING
    },
    {}
  );
  Video.associate = function(models) {
    // associations can be defined here
  };
  return Video;
};

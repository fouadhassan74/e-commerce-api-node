const cloudinary = require("cloudinary");
const asyncHandler = require("express-async-handler");
cloudinary.config({
  cloud_name: "dcwgmivvl",
  api_key: "937324453428255",
  api_secret: "lNaccUSIeWshQNbL7F6qflJvihc",
});

const cloudinaryUploadImage = asyncHandler(async (fileToUplaod) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToUplaod, (err, result) => {
      if (err) throw new Error(err);
      resolve(result);
    });
  });
});
module.exports = {
  cloudinaryUploadImage,
};

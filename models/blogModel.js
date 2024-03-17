const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;
const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title of the blog is required"],
    },
    description: {
      type: String,
      required: [true, "description of the blog is required"],
    },
    category: {
      type: String,
      required: [true, "category of the blog is required"],
    },
    numViews: {
      type: Number,
      default: 0,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisliked: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: objectId,
        ref: "User",
      },
    ],
    disLikes: [
      {
        type: objectId,
        ref: "User",
      },
    ],
    author: {
      type: String,
      default: "Admin",
    },
    images: [],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);
//local module export
module.exports = mongoose.model("Blog", blogSchema);

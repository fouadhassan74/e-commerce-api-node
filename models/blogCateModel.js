const mongoose = require("mongoose");
const blogCateSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title of the category required"],
      unique: [true, "there is similar in db"],
      index: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("BlogCate", blogCateSchema);

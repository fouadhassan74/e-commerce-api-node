const mongoose = require("mongoose");
const brandSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title of the brand required"],
      unique: [true, "there is similar in db"],
      index: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Brand", brandSchema);

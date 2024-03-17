const mongoose = require("mongoose");
const couponSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "the title is required"],
    unique: [true, "the title is unique"],
    uppercase: true,
  },
  expiry: {
    type: Date,
    required: [true, "the expiry is required"],
  },
  discount: {
    type: Number,
    required: [true, "the discount is required"],
  },
});
module.exports = mongoose.model("Coupon", couponSchema);

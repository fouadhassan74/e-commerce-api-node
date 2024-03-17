const mongoose = require("mongoose");
const { Schema } = mongoose;
const objectId = mongoose.Types.ObjectId;
const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "the firstname is required"],
    },
    lastname: {
      type: String,
      required: [true, "the lastname is required"],
    },
    email: {
      type: String,
      required: [true, "the email is required"],
      unique: [true, "there is a email such is like these"],
    },
    mobil: {
      type: Number,
      required: [true, "the mobil is required"],
      unique: [true, "there is a mobile such is like these"],
      min: [11, "this is not a phone number"],
      min: [12, "this is not a phone number"],
    },
    password: {
      type: String,
      required: [true, "the password is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    cart: {
      type: Array,
      default: [],
    },
    addresses: {
      type: objectId,
      ref: "Address",
    },
    wishList: [
      {
        type: objectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);

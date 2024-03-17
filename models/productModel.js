const mongoose = require("mongoose");
const { Schema } = mongoose;
const objectId = mongoose.Types.ObjectId;
const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "the tilte is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: [true, "the tilte must be unique"],
      required: [true, "the tilte must be required"],
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "the description must be required"],
    },
    price: {
      type: Number,
      required: [true, "the Price must be required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    brand: {
      type: String,
      enum: ["Apple", "Samsung", "Lenovo", "Hp"],
    },
    quantity: {
      type: Number,
      required: [true, "the quantity must be required"],
      default: 1,
    },
    sold: {
      type: Number,
      default: 0,
      select: false,
    },
    images: {
      type: Array,
    },
    colour: {
      type: String,
      enum: ["Black", "Brown", "Red"],
    },
    rating: [
      {
        star: Number,
        comment: String,
        postedby: {
          type: objectId,
          ref: "User",
        },
      },
    ],
    totalRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", productSchema);

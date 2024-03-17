const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongoDbId");
//create a product
const createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  try {
    const newProduct = new Product({
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,
      price: req.body.price,
      brand: req.body.brand,
      quantity: req.body.quantity,
    });
    const savedProduct = await newProduct.save();
    res.status(200).json({
      savedProduct,
      msg: "Product Saved successfully ",
      success: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});
//update a product
const updateProduct = asyncHandler(async (req, res) => {
  if (req?.body?.title) req.body.slug = slugify(req?.body?.title);
  const id = req.params.id;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      data: updatedProduct,
      msg: "product updated successfully",
      success: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});
// delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findByIdAndDelete(id);
    res
      .status(200)
      .json({ msg: "product deleted successfully", success: true });
  } catch (err) {
    throw new Error(err);
  }
});
// get a product
const getProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    res.status(200).json({
      product: product,
      msg: "product get successfully",
      success: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});
// get all products
const getAllProducts = asyncHandler(async (req, res) => {
  //Filtiring
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "field"];
  excludeFields.forEach((field) => delete queryObj[field]);
  // original obj req.query
  //modfied one is queryObj
  // query pasrer
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  console.log(JSON.parse(queryStr));
  // pass query like that price[gte]=100
  let query = Product.find(JSON.parse(queryStr));
  //Sorting
  if (req.query.sort) {
    const sortedBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortedBy);
  } else {
    query = query.sort("-createdAt");
  }
  // Limiting Fields
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v");
  }
  //Pagination
  let page = req.query.page;
  let limit = req.query.limit;
  // the skiping products from database and limit give me how many products will be in the page
  let skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);
  if (req.query.page) {
    // give to me how many products in the DB
    const productCount = await Product.countDocuments();
    if (skip >= productCount) throw new Error("This Page does not exists");
  }
  try {
    const products = await query;
    res.status(200).json({
      products: products,
      msg: "all products get successfully",
      success: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});
/**
 *@desc add a product to wish list
 *@method PUT
 *@route /wish
 *@access private
 */

const addToWhishList = asyncHandler(async (req, res) => {
  const loginId = req?.user?._id;
  console.log(loginId);
  const productId = req.body.productId;
  validateMongoDbId(loginId);
  validateMongoDbId(productId);
  try {
    const user = await User.find(loginId);
    const alreadyadded = user[0]?.wishList?.find(
      (id) => id?.toString() === productId?.toString()
    );
    if (alreadyadded) {
      const user = await User.findByIdAndUpdate(
        loginId,
        {
          $pull: { wishList: productId },
        },
        { new: true }
      );
      res.status(200).json({
        data: user,
        msg: "product removed successfully",
        success: true,
      });
    } else {
      const user = await User.findByIdAndUpdate(
        loginId,
        {
          $push: { wishList: productId },
        },
        { new: true }
      );
      res.status(200).json({
        data: user,
        msg: "product added successfully",
        success: true,
      });
    }
  } catch (err) {
    throw new Error(err);
  }
});
/**
 *@desc add a rating to a product
 *@method PUT
 *@route /rating
 *@access private
 */
const rating = asyncHandler(async (req, res) => {
  const loginId = req?.user?._id;
  const { comment, star, productId } = req.body;
  validateMongoDbId(loginId);
  validateMongoDbId(productId);
  try {
    const product = await Product.findById(productId);
    const alreadyRated = product.rating.find(
      (userId) => userId.postedby.toString() === loginId.toString()
    );

    if (alreadyRated) {
      const updatedRating = await Product.updateOne(
        {
          rating: { $elemMatch: alreadyRated },
        },
        {
          $set: {
            "rating.$.star": star,
            "rating.$.comment": comment,
          },
        },
        {
          new: true,
        }
      );
      // const updatedRating = await Product.findByIdAndUpdate(
      //   productId,
      //   {
      //     //In the $set operator, we use the positional operator $[elem] to identify the element in
      //     //the rating array that matches the _id of alreadyRated. This allows us to update the
      //     //specific element.
      //     $set: {
      //       "rating.$[elem].star": star,
      //       "rating.$[elem].comment": comment,
      //     },
      //   },
      //   {
      //     //We introduce the arrayFilters option in the Product.findByIdAndUpdate()
      //     //method. It uses the elem._id field to match the _id of alreadyRated and update the
      //     //corresponding element in the rating array.
      //     arrayFilters: [{ "elem._id": alreadyRated._id }],
      //     new: true,
      //   }
      // );
      // console.log(updatedRating);
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $push: {
            rating: {
              star: star,
              comment: comment,
              postedby: loginId,
            },
          },
        },
        { new: true }
      );
    }
    const getAllRating = await Product.findById(productId);
    const getTotlarating = getAllRating.rating.length;
    let ratingSum = getAllRating?.rating
      ?.map((item) => item.star)
      ?.reduce((previousValue, currentValue, currentIndex, array) => {
        return previousValue + currentValue;
      }, 0);
    const actualRating = Math.round(ratingSum / getTotlarating);
    let finalproduct = await Product.findByIdAndUpdate(
      productId,
      {
        totalRating: actualRating,
      },
      { new: true }
    );
    res.status(200).json({
      data: finalproduct,
      msg: "product rated successfully",
      success: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});
const uploadImages = asyncHandler(async (req, res) => {
  console.log(req.files);
});
module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWhishList,
  rating,
  uploadImages,
};

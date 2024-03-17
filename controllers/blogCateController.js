const asyncHandler = require("express-async-handler");
const BlogCate = require("../models/blogCateModel.js");
const validateMongoDbId = require("../utils/validateMongoDbId.js");
/**
 * @desc create a new category product
 * @method POST
 * @route /
 * @access private
 */
const createCategory = asyncHandler(async (req, res) => {
  try {
    const blogCate = new BlogCate(req.body);
    const savedBlogCate = await blogCate.save();
    res.status(201).json({
      data: savedBlogCate,
      msg: "category created successfully",
      Success: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});

/**
 * @desc updaet a  category product
 * @method PUT
 * @route /:id
 * @access private
 */
const updateCategort = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    validateMongoDbId(id);
    const updatedCategory = await BlogCate.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json({
      data: updatedCategory,
      msg: "the category updated successfully",
      Success: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});

/**
 * @desc get a category product
 * @method GET
 * @route /:id
 * @access private
 */
const getCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    validateMongoDbId(id);
    const category = await BlogCate.findById(id);
    res.status(202).json({
      data: category,
      msg: "the category fetched successfully",
      Success: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});

/**
 * @desc Get a All category product
 * @method GET
 * @route /
 * @access private
 */
const gatAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await BlogCate.find();
    res
      .status(203)
      .json({ data: categories, msg: "all categories fetched", Success: true });
  } catch (err) {
    throw new Error(err);
  }
});

/**
 * @desc Delete a category product
 * @method DELETE
 * @route /:id
 * @access private
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    validateMongoDbId(id);
    const deletedCategory = await BlogCate.findByIdAndDelete(id);
    res
      .status(203)
      .json({ msg: "category deleted successfully", Success: true });
  } catch (err) {
    throw new Error(err);
  }
});
module.exports = {
  createCategory,
  updateCategort,
  getCategory,
  gatAllCategories,
  deleteCategory,
};

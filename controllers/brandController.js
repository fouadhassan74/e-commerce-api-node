const asyncHandler = require("express-async-handler");
const Brand = require("../models/brandModel");
const validateMongoDbId = require("../utils/validateMongoDbId.js");
/**
 * @desc create a new brand
 * @method POST
 * @route /
 * @access private
 */
const createBrand = asyncHandler(async (req, res) => {
  try {
    const brand = new Brand(req.body);
    const savedBrand = await brand.save();
    res.status(201).json({
      data: savedBrand,
      msg: "the brand created successfully",
      Success: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});

/**
 * @desc update a product
 * @method PUT
 * @route /:id
 * @access private
 */
const updateBrand = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const updateBrand = await Brand.findByIdAndUpdate(id);
    res.status(202).json({
      data: updateBrand,
      msg: "the brand updated successfully",
      Success: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});

/**
 * @desc delete a brand
 * @method DELETE
 * @route /:id
 * @access private
 */
const deleteBrand = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const deleteBrand = await Brand.findByIdAndDelete(id);
    res
      .status(200)
      .json({ msg: "the brand deleted successfully", success: true });
  } catch (err) {
    throw new Error(err);
  }
});

/**
 * @desc get a brand
 * @method GET
 * @route /:id
 * @access private
 */
const getBrand = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const brand = await Brand.findById(id);
    res.status(200).json({
      data: brand,
      msg: "the brand found successfully",
      success: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});

/**
 * @desc get all brands
 * @method GET
 * @route /
 * @access private
 */
const getAllBrands = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json({
      data: brands,
      msg: "the brands found successfully",
      success: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getAllBrands,
};

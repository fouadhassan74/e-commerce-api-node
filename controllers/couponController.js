const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId.js");
/**
 * @desc create a new coupon
 * @method POST
 * @route /
 * @access private
 */
const createCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    const savedCoupon = await coupon.save();
    res.status(201).json({
      data: savedCoupon,
      msg: "the coupon created successfully",
      success: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});

/**
 * @desc update a coupon
 * @method PUT
 * @route /:id
 * @access private
 */
const updateCoupon = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json({
      data: updateCoupon,
      msg: "coupon updated successfully",
      scuccess: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});

/**
 * @desc delete a coupon
 * @method DELETE
 * @route /:id
 * @access private
 */
const deleteCoupon = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const deleted = await Coupon.findByIdAndDelete(id);
    res.json({ msg: "the coupon deleted successfully", scuccess: true });
  } catch (err) {
    throw new Error(err);
  }
});

/**
 * @desc get a coupon
 * @method GET
 * @route /:id
 * @access private
 */
const getCoupon = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const coupon = await Coupon.findById(id);
    res.status(201).json({
      data: coupon,
      msg: "the coupon geted successfully",
      success: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});

/**
 * @desc get all coupon
 * @method GET
 * @route /
 * @access private
 */
const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(201).json({
      data: coupons,
      msg: "the coupons geted successfully",
      success: true,
    });
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  getAllCoupons,
};

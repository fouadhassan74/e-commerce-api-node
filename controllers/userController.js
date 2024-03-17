const User = require("../models/userModel.js");
const validateMongoDbId = require("../utils/validateMongoDbId.js");
const {
  hashpassword,
  comparePassword,
} = require("../helpers/passwordHashingHandler.js");
const Jwt = require("jsonwebtoken");
const { jwtTokenGenrator } = require("../config/jwtToken.js");
const { genrateRefreshToken } = require("../config/refreshToken.js");
const asyncHandler = require("express-async-handler");
// User Regestration
const createuser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    const newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      mobil: req.body.mobil,
      password: await hashpassword(req.body.password),
    });
    const savedUser = await newUser.save();
    res.status(201).json({
      newUser: savedUser,
      msg: "user created successfully",
      success: true,
    });
  } else {
    throw new Error("User Already exists");
  }
});
// login
const loginUser = asyncHandler(async (req, res) => {
  const { password, email } = req.body;
  const findUser = await User.findOne({ email: email });
  const hashedpassword = findUser.password;
  if (findUser && (await comparePassword(password, hashedpassword))) {
    const { password, ...others } = findUser._doc;
    const id = others._id;
    validateMongoDbId(id);
    const refreshToken = genrateRefreshToken(id);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // only reed by server side
      maxAge: 72 * 60 * 60 * 1000, // measured by ms so it equals 3days
    });
    const token = jwtTokenGenrator(id);
    res.status(200).json({
      user: { ...others, refreshToken: refreshToken, token: token },
      msg: "user loged in successfully",
      success: true,
    });
  } else {
    throw new Error("password or email is incorrect");
  }
});
//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  const refreshToken = cookie.refreshToken;
  if (!refreshToken) throw new Error("No refresh token in Cookies");
  const user = await User.findOne({ refreshToken: refreshToken });
  if (!user) throw new Error("No Refresh Token Has Been Matched in Database");
  const id = user.id;
  validateMongoDbId(id);
  Jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decode) => {
    if (err || id !== decode.id)
      throw new Error("There is Something Wrong with Refresh Token");
  });
  const accessToken = await jwtTokenGenrator(id);
  res.status(201).json({
    accessToken: accessToken,
    msg: "the token has been refreshed",
    success: true,
  });
});
// logout
//error
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  const refreshToken = cookie?.refreshToken;
  if (!refreshToken) throw new Error("No refresh token in Cookies");
  const user = await User.findOne({ refreshToken: refreshToken });
  if (!user) {
    res
      .clearCookie("refreshToken", { httpOnly: true, secure: false })
      .status("204")
      .json({ msg: "you has been logged out" });
    // return res; //forbbiden
  }
  await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
  res
    .clearCookie("refreshToken", { httpOnly: true, secure: false })
    .status("204")
    .json({ msg: "you has been logged out" });
});
//get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res
      .status(200)
      .json({ users, msg: "all users fetched successfully", success: true });
  } catch (err) {
    throw new Error(`there is something error ...is ${err}`);
  }
});
// get a user
const getUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);
    const { password, ...others } = user._doc;
    res
      .status(200)
      .json({ others, msg: "user get successfully", success: true });
  } catch (err) {
    throw new Error(`there is something error....the error is ${err}`);
  }
});
// delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const user = await User.findByIdAndDelete(id);
    const { password, ...others } = user._doc;
    res
      .status(200)
      .json({ others, msg: "user Deleted successfully", success: true });
  } catch (err) {
    throw new Error(`there is something error....the error is ${err}`);
  }
});
// update a user
const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobil: req.body.mobil,
        password: await hashpassword(req.body.password),
      },
      { new: true }
    );
    const { password, ...others } = user._doc;
    res
      .status(200)
      .json({ others, msg: "user updated successfully", success: true });
  } catch (err) {
    throw new Error(`there is something error....the error is ${err}`);
  }
});
// block user
const blockUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.status(200).json({ msg: "user has been Blocked", success: true });
  } catch (err) {
    throw new Error(`there is something error`);
  }
});
// unblock user
const unblockUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongoDbId(id);
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    res.status(200).json({ msg: "user has been unBlocked", success: true });
  } catch (err) {
    throw new Error(`there is something error`);
  }
});
module.exports = {
  createuser,
  loginUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  unblockUser,
  blockUser,
  handleRefreshToken,
  logout,
};

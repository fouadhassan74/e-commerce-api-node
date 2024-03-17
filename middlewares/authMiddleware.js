const Jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId.js");
const authMiddleware = asyncHandler(async (req, res, next) => {
  let authorizationToken = req?.headers?.authorization;
  if (authorizationToken?.startsWith("Bearer")) {
    token = authorizationToken.split(" ")[1];
    try {
      const decoded = Jwt.verify(token, process.env.JWT_SECRET_KEY);
      const id = decoded.id;
      validateMongoDbId(id);
      const user = await User.findById(id);
      req.user = user;
      next();
    } catch (e) {
      return res.status(401).json({ Status: "Unauthorized" });
    }
  } else {
    throw new Error("There is no token Attached with header");
  }
});
const verifyTokenAndAdmin = asyncHandler(async (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req?.user?.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
});

module.exports = { authMiddleware, verifyTokenAndAdmin };

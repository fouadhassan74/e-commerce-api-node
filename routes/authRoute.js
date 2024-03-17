const express = require("express");
const {
  createuser,
  loginUser,
  handleRefreshToken,
  logout,
} = require("../controllers/userController");
const router = express.Router();
router.post("/register", createuser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.post("/refresh", handleRefreshToken);
module.exports = router;

const express = require("express");
const {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  unblockUser,
  blockUser,
} = require("../controllers/userController");
const {
  authMiddleware,
  verifyTokenAndAdmin,
} = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);
router.put("/block-user/:id", authMiddleware, verifyTokenAndAdmin, blockUser);
router.put(
  "/unblock-user/:id",
  authMiddleware,
  verifyTokenAndAdmin,
  unblockUser
);
module.exports = router;

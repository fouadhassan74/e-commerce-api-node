const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
// methods requartion
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeTheBlog,
  disLikeTheBlog,
} = require("../controllers/blogController");
router.route("/like").put(authMiddleware, likeTheBlog);
router.route("/dislike").put(authMiddleware, disLikeTheBlog);
router.route("/").post(createBlog).get(getAllBlogs);
router.route("/:id").put(updateBlog).get(getBlog).delete(deleteBlog);

// local module exporting
module.exports = router;

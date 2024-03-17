const router = require("express").Router();
const {
  verifyTokenAndAdmin,
  authMiddleware,
} = require("../middlewares/authMiddleware");
const {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWhishList,
  rating,
  uploadImages,
} = require("../controllers/productController");
const {
  uploadPhoto,
  productImgResize,
} = require("../middlewares/uploadImages");
router.route("/").post(createProduct).get(getAllProducts);
router.route("/wish").put(authMiddleware, addToWhishList);
router.route("/rating").put(authMiddleware, rating);
router
  .route("/upload/:id")
  .put(uploadPhoto.array("image", 10), productImgResize, uploadImages);

router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;

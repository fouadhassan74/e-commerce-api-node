const router = require("express").Router();
const {
  createCategory,
  updateCategort,
  getCategory,
  gatAllCategories,
  deleteCategory,
} = require("../controllers/productCateController");
router.route("/").post(createCategory).get(gatAllCategories);
router
  .route("/:id")
  .put(updateCategort)
  .get(getCategory)
  .delete(deleteCategory);

module.exports = router;

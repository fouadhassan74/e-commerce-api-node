const router = require("express").Router();
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getAllBrands,
} = require("../controllers/brandController");

router.route("/").post(createBrand).get(getAllBrands);
router.route("/:id").delete(deleteBrand).put(updateBrand).get(getBrand);
module.exports = router;

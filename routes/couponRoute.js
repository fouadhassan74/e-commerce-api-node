const router = require("express").Router();
const {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  getAllCoupons,
} = require("../controllers/couponController");
router.route("/").get(getAllCoupons).post(createCoupon);
router.route("/:id").delete(deleteCoupon).put(updateCoupon).get(getCoupon);
module.exports = router;

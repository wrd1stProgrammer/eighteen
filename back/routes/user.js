const express = require("express");
const {
  getProfile,
  updateProfile,
  saveVerification,
  registerAccountApi,
  withdrawApi,
  getWithdrawList,
  editProfile,
  updateAddress
} = require("../controllers/auth/user");

const router = express.Router();

router.route("/profile").get(getProfile);
router.post(`/saveVerification`,saveVerification);
router.post(`/registeraccount`,registerAccountApi);
router.post(`/withdraw`,withdrawApi);
router.get(`/getwithdrawlist`,getWithdrawList);
router.post(`/editprofile`,editProfile);
router.put('/:id/update-address', updateAddress)
module.exports = router;
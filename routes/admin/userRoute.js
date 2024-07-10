const router = require("express").Router();
const { query } = require("express-validator");

// const { register } = require("../../controller/userController");
const userController = require("../../controller/userController");
const auth = require("../../middlewares/auth");
const {
  registerValidation,
  loginValidation,
  sendotp,
  verifyotp,
  askBooking,
} = require("../../middlewares/validate");

router.post("/register", registerValidation, userController.register);
router.get("/login", loginValidation, userController.login);
router.post("/sendOTP", sendotp, userController.sendOTP);
router.post("/verifyOTP", verifyotp, userController.verifyOTP);
router.post("/changePassword", auth, userController.changePassword);
router.post("/askBooking", askBooking, userController.askBooking);
// router.post("/forgotPassword", userController.forgotPassword);

module.exports = router;

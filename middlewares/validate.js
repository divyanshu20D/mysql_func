const jwt = require("jsonwebtoken");
const { mysecret } = require("../controller/userController");

const registerValidation = (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }
    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }
    if (!first_name) {
      return res.status(400).json({
        message: "First Name is required",
      });
    }
    if (!last_name) {
      return res.status(400).json({
        message: "Last Name is required",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while validating user",
    });
  }
};

const loginValidation = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }
    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while login",
    });
  }
};

const sendotp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while sending OTP",
    });
  }
};

const verifyotp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while verifying otp",
    });
  }
};

const askBooking = async (req, res, next) => {
  try {
    const { id, session_date, session_time, session_mode } = req.body;
    const token = req.headers.authorization;
    const decodedToken = await jwt.verify(token, mysecret);

    if (!decodedToken) {
      return res.status(400).json({
        mesage: "Not authorized.",
      });
    }
    const adminId = decodedToken.admin_id;
    if (!session_date) {
      return res.status(400).json({
        message: "Session Date is required",
      });
    }
    if (!session_time) {
      return res.status(400).json({
        message: "Session Date is required",
      });
    }

    const mode = ["Online", "Offline"];
    if (!mode.includes(session_mode)) {
      return res.status(400).json({
        message: "Mode can be either Online or Offline.",
      });
    }
    req.adminId = adminId;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error validating create booking.",
    });
  }
};

module.exports = {
  registerValidation,
  loginValidation,
  sendotp,
  verifyotp,
  askBooking,
};

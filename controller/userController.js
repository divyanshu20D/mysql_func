const bcrypt = require("bcryptjs");
const { insert, select, update } = require("../config/db");
const jwt = require("jsonwebtoken");
const AdminModel = require("../models/adminModel");
const authEmail = require("../config/mailer");
const nodemailer = require("nodemailer");

const mysecret = "anshu";

const register = async (req, res) => {
  try {
    const { first_name = "", last_name = "", email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [check] = await select("*", "admin", { email: email });

    if (check.length > 0) {
      return res.status(400).json({
        msg: "Email already exists",
      });
    }

    const result = await AdminModel.registerAdmin("admin", {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedPassword,
    });

    const [getAdmin] = await select("*", "admin", { email: email });

    return res.status(200).json({
      data: getAdmin,
      message: "Admin created",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while creating admin",
    });
  }
};

// const registerUser = async (req, res) => {
//   try {
//     const valid = validationResult(req.body);
//     if (!validationResult) {
//       return validationResult;
//     }
//     console.log(valid);
//     if (valid.isEmpty()) {
//       return res.json({
//         message: "Email is required",
//       });
//     }
//     res.send({ errors: valid.array() });

//     const { first_name = "", last_name = "", email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const [check] = await select("*", "admin", { email: email });
//     if (check.length > 0) {
//       return res.status(400).json({
//         msg: "Email already exists",
//       });
//     }
//     const result = await AdminModel.registerAdmin("admin", {
//       first_name: first_name,
//       last_name: last_name,
//       email: email,
//       password: hashedPassword,
//     });

//     const [getAdmin] = await select("*", "admin", { email: email });
//     // const token = jwt.sign({ first_name, email }, mysecret);
//     return res.status(200).json({
//       data: getAdmin,
//       message: "Admin created",
//       //   token: token,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       message: "Error wile creating admin",
//     });
//   }
// };

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [person] = await select("*", "admin", { email: email });
    // console.log("person :- ", person);

    if (person.length === 0) {
      return res.status(400).json({ message: "Wrong Credentials" });
    }

    const admin1 = person[0];
    // console.log(admin1);
    // console.log("normal password", password);
    // console.log("admin ka password ", admin1.password);
    const validation = await bcrypt.compare(password, admin1.password);
    // console.log(validation);
    if (!validation) {
      return res.status(400).json({ message: "Wrong Credentials" });
    } else {
      const token = jwt.sign(
        { first_name: admin1.first_name, email: admin1.email },
        mysecret
      );
      const updation = await update("admin", { token: token }, email);
      res.status(200).json({
        user: admin1,
        // token: token,
        message: "Login successfull",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error during Login",
    });
  }
};

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   const person = await select("*", "admin", { email: email });
//   const admin1 = person[0];
//   try {
//     const validation = await bcrypt.compare(password, admin1.password);
//     if (!validation) {
//       res.json({
//         message: "Wrong Credentials",
//       });
//     } else {
//       const token = jwt.sign(
//         { first_name: admin1.first_name, email: admin1.email },
//         mysecret
//       );
//       res.status(200).json({
//         user: admin1,
//         token: token,
//         message: "Login successfull",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({
//       message: "Wrong credentials11",
//     });
//   }
// };

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const [result] = await select("*", "admin", { email: email });
    if (result) {
      const number = Math.floor(100000 + Math.random() * 900000);
      res.render(
        "welcome",
        { number: number, userName: result[0].first_name },
        (err, template) => {
          if (err) {
            throw err;
          } else {
            const reciever = {
              from: "divyanshu.designoweb@gmail.com",
              to: email,
              subject: "Bas aisehi, chill...!!!",
              html: template,
            };

            authEmail.sendMail(reciever, (error, response) => {
              if (error) {
                throw error;
              }
              console.log("mail sent successfully");
              res.status(200).json({
                message: "Mail sent successfully.",
              });
            });
          }
        }
      );
      const updation = await update("admin", { otp: number }, email);
      if (updation) {
        res.status(200).json({
          message: "OTP Sent",
          otp: number,
        });
      } else {
        res.json({
          msg: "Error",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      mesage: "No such user",
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const users = await select("*", "admin", { email: email });

    if (users.length === 0) {
      return res.status(400).json({ message: "No such user" });
    }

    const [user] = users[0];
    // console.log(user);
    // console.log(user.otp);
    // console.log("ye hai otp", otp);

    if (otp == Number(user.otp)) {
      res.status(200).json({ message: "User verified" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

// const verifyOTP = async (req, res) => {
//   const { otp, email } = req.body;
//   console.log(otp);
//   const user = await select("*", "admin", { email: email });
//   console.log(user.otp);
//   if (user) {
//     if (otp == user.otp) {
//       res.status(200).json({
//         message: "user verified",
//       });
//     } else {
//       res.status(400).json({
//         message: "Invalid OTP",
//       });
//     }
//   }
// };

const changePassword = async (req, res) => {
  try {
    const email = req.email;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current Password and New Password are required",
      });
    }
    const [users] = await select("*", "admin", { email: email });
    // console.log("users:- ", users);
    if (users.length === 0) {
      return res.status(400).json({ message: "No such user" });
    }
    const user = users[0];
    req.user = user;
    console.log("user :- ", user);
    // console.log("old", user.password);
    // console.log("current pasword : ", currentPassword);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    // console.log(" ismatch result :- ", isMatch);
    if (isMatch) {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const updation = await update(
        "admin",
        { password: hashedNewPassword },
        email
      );
      const [changesAdmin] = await select("*", "admin", { email: email });
      return res
        .status(200)
        .json({ message: "Password changed", data: changesAdmin });
    } else {
      res.status(400).json({
        message: "Wrong current password",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error changing password" });
  }
};

const askBooking = async (req, res) => {
  try {
    const adminId = req.adminId;
    const { id, session_date, session_time, session_mode } = req.body;
    const result = await insert("bookings", {
      admin_id: adminId,
      id: id,
      session_date: session_date,
      session_time: session_time,
      session_mode: session_mode,
    });
    const [bookings] = await select("*", "bookings", { id: id });
    if (result) {
      res.status(200).json({
        message: "Booking created, waiting for Psychologist's action.",
        data: bookings,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Creating Booking failed.",
    });
  }
};

// const forgotPassword = async (req, res) => {
//   try {
//     const { email, currentPassword, newPassword, confirmPassword } = req.body;

//     const [users] = await select("*", "admin", { email: email });
//     console.log("users:- ", users);

//     if (users.length === 0) {
//       return res.status(400).json({ message: "No such user" });
//     } else if (newPassword != confirmPassword) {
//       return res.status(400).json({
//         message: "New Password and Confirm Password are not same",
//       });
//     }

//     const user = users[0];
//     console.log("user :- ", user);
//     console.log("old", user.password);
//     console.log("current pasword : ", currentPassword);
//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     console.log(" ismatch result :- ", isMatch);
//     if (isMatch) {
//       const hashedNewPassword = await bcrypt.hash(newPassword, 10);
//       const updation = await update(
//         "admin",
//         { password: hashedNewPassword },
//         email
//       );
//       const [changesAdmin] = await select("*", "admin", { email: email });
//       return res
//         .status(200)
//         .json({ message: "Password changed", data: changesAdmin });
//     } else {
//       res.status(400).json({
//         message: "Wrong current password",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error changing password" });
//   }
// };

module.exports = {
  register,
  login,
  sendOTP,
  verifyOTP,
  changePassword,
  mysecret,
  askBooking,
  // forgotPassword,
  // registerUser,
};

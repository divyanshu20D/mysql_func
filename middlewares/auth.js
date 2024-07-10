const jwt = require("jsonwebtoken");
const { mysecret } = require("../controller/userController");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    // console.log(token);
    const decodedToken = jwt.verify(token, mysecret);
    // console.log(decodedToken);
    const email = decodedToken.email;
    // console.log(email);
    req.email = email;
    if (req.body.email && req.body.email !== email) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: "Invalid Token!",
    });
  }
};

// module.exports = changePassword;

// const jwt = require("jsonwebtoken");
// const { mysecret } = require("../controller/userController");

// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization;
//     const decodedToken = jwt.verify(token, mysecret);
//     const email = decodedToken.email;
//     req.email = email; // Attach the email to the request object
//     next();
//   } catch (error) {
//     res.status(401).json({
//       error: "Invalid Token!",
//     });
//   }
// };

// const bcrypt = require('bcrypt');
// const { select, update } = require('./db'); // Adjust the path as needed

// const changePassword = async (req, res) => {
//   try {
//     const email = req.email; // Get the email from the request object
//     const { currentPassword, newPassword } = req.body;

//     const [users] = await select("*", "admin", { email: email });
//     if (users.length === 0) {
//       return res.status(400).json({ message: "No such user" });
//     }

//     const user = users[0];
//     req.user = user;

//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (isMatch) {
//       const hashedNewPassword = await bcrypt.hash(newPassword, 10);
//       await update("admin", { password: hashedNewPassword }, { email: email });

//       const [changesAdmin] = await select("*", "admin", { email: email });
//       return res.status(200).json({ message: "Password changed", data: changesAdmin });
//     } else {
//       res.status(400).json({ message: "Wrong current password" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error changing password" });
//   }
// };

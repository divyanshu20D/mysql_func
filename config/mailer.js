const nodemailer = require("nodemailer");

const authEmail = nodemailer.createTransport({
  service: "gmail",
  secure: "true",
  port: "465",
  auth: {
    user: "divyanshu.designoweb@gmail.com",
    pass: "spfuwgvcgyehwhwc",
  },
});

module.exports = authEmail;

require('dotenv').config()
const nodemailer = require("nodemailer");

// const crypto = require("crypto");
const md5 = require("md5");

const generatePasswordHash = (password) => {
    // const salt = crypto.randomBytes(16).toString("hex");
    // const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    // return { salt, hash };
    return md5(password);
};

const verifyPassword = (password, salt = false, hash) => {
    // const derivedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    // return derivedHash === hash;
    return md5(password) === hash;
};


const sendEmail = async ({subject, message, to}) => {
  const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
  });

  try {
      await transporter.sendMail({
          from: `"App" <${process.env.EMAIL}>`,
          to,
          subject: subject,
          html: message,
      });
      return true
  } catch (error) {
      console.error("Error sending email:", error.message);
      return false
  }
}


  

module.exports = { generatePasswordHash, verifyPassword, sendEmail }
require('dotenv').config()
const nodemailer = require("nodemailer");

// const crypto = require("crypto");
const md5 = require("md5");
const { options } = require('joi');

const generatePasswordHash = (password) => {
    // const salt = crypto.randomBytes(16).toString("hex");
    // const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    // return { salt, hash };
    return md5(password);
};

const verifyPassword = (password, salt = false, hash) => {

    return md5(password) === hash;
};


const sendEmail = async ({ subject, message, to, options }) => {
    const transporter = nodemailer.createTransport(options);

    try {
        await transporter.sendMail({
            from: `"App" <${options.auth.user}>`,
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
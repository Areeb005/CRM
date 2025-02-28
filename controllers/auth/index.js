const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {
  generatePasswordHash,
  verifyPassword,
  checkEmailAcrossModels,
  sendEmail,
} = require("../../helpers/functions");
const { User, ActivityLog } = require("../../models");
const SMTPSettings = require("../../models/smtp_model");
const { Op } = require("sequelize");

const authCrtl = {
  register: async (req, res) => {
    try {

      // return res.status(400).json({ message: 'This service in unavailable currently.' })

      // Joi schema for validation
      const schema = Joi.object({
        username: Joi.string().min(1).max(255).required().default(null),
        full_name: Joi.string().min(1).max(255).required().default(null),
        profile_picture: Joi.string()
          .uri()
          .max(255)
          .optional()
          .default("https://cdn-icons-png.flaticon.com/256/6522/6522516.png"),
        email: Joi.string().email().required(),
        password: Joi.string()
          .pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$"))
          .required()
          .messages({
            "string.pattern.base":
              "Password must contain at least one uppercase letter, one special character, one number, and be at least 8 characters long.",
          }),
        firm_name: Joi.string().required().default(null),
        phone: Joi.number().integer().required(),
        address: Joi.string().required().default(null),
        state: Joi.string().required().default(null),
        city: Joi.string().required().default(null),
        zip: Joi.string().required().default(null),
        app_acc_no: Joi.number().integer().optional(),
        status: Joi.boolean().default(true).optional(),
        otp: Joi.string().optional().default(null),
        opt_used: Joi.boolean().default(false).optional(),
        otp_expire_time: Joi.date().optional().default(null),
      });

      // Validate request body
      const { error, value } = schema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      // Destructure validated data
      const {
        username,
        full_name,
        profile_picture,
        email,
        password,
        firm_name,
        phone,
        address,
        state,
        zip,
        app_acc_no,
        city
      } = value;

      // Check if user already exists
      const existingUserEmail = await User.findOne({ where: { email } });
      if (existingUserEmail)
        return res.status(409).json({ error: "Email already registered" });

      const existingUser = await User.findOne({ where: { username } });
      if (existingUser)
        return res.status(409).json({ error: "Username already registered" });


      // Hash password
      const hash = generatePasswordHash(password);


      // Create user
      const newUser = await User.create({
        username,
        full_name,
        profile_picture,
        email,
        password: hash,
        firm_name,
        phone,
        address,
        state,
        zip,
        app_acc_no,
        role: "attorney",
        city,
        status: true, // Default status
      });

      // Generate access token
      const access_token = createAccessToken({ id: newUser.id, role: newUser.role });

      // Log user registration
      await ActivityLog.create({
        user_id: newUser.id,
        action_type: "user_registered",
        description: `New user registered with email {${email}} as {${newUser.role}}.`,
      });

      // Return success response
      return res.status(200).json({
        success: "User registered successfully",
        access_token,
        data: newUser,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  login: async (req, res) => {
    try {
      // Joi schema for validation
      const schema = Joi.object({
        username: Joi.string().required(), // Username is required
        password: Joi.string().required(), // Password is required
      });

      // Validate request body
      const { error, value } = schema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const { username, password } = value;

      // Check if user exists
      let user = await User.findOne({
        where: { username }, // Find user by username
        attributes: { exclude: ["createdAt", "updatedAt"] }, // Exclude unnecessary fields
      });

      if (!user)
        return res.status(404).json({ error: "Username does not exist" });

      // Check if the user's account is active
      if (!user.status)
        return res.status(403).json({ error: "Your account is blocked" });

      // Verify password
      const isPasswordValid = verifyPassword(password, user.salt, user.password);
      if (!isPasswordValid)
        return res.status(401).json({ error: "Incorrect password" });

      // Generate access token
      const access_token = createAccessToken({ id: user.id, role: user.role });

      user = user.toJSON()
      delete user.password

      // Return success response
      return res.status(200).json({
        success: "Login successful",
        access_token,
        data: user,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
      });

      const { error, value } = schema.validate(req.body);

      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const user = await User.findOne({ where: { email: value.email } });

      if (!user) return res.status(400).json({ error: "Email does not exist" });

      // Generate OTP and set expiration time
      const otp = Math.floor(100000 + Math.random() * 900000);
      const expireTime = new Date(Date.now() + 5 * 60 * 1000);

      user.otp = otp;
      user.otp_used = false;
      user.otp_expire_time = expireTime;

      await user.save();

      const message = `${otp} is your OTP for password reset. It will expire in 5 minutes.`;

      let options = {};

      const settings = await SMTPSettings.findOne({ where: { id: 1 } });

      if (settings) {
        options = {
          host: settings.smtp_server,
          port: settings.smtp_port,
          secure: settings.use_tls,
          auth: {
            user: settings.smtp_username,
            pass: settings.smtp_password,
          },
        };
      } else {
        options = {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: true,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
          },
        }
      }


      // Send email
      await sendEmail({
        options,
        to: user.email,
        subject: "Password Reset OTP",
        message,
      });

      return res
        .status(200)
        .json({
          success: "OTP has been sent to your email. Valid for 5 minutes.",
        });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
          .min(6)
          .pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$&*]).*$"))
          .required(),
        otp: Joi.string().min(6).max(6).required(),
      });

      const { error, value } = schema.validate(req.body);

      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const user = await User.findOne({ where: { email: value.email } });

      if (!user) return res.status(400).json({ error: "Email does not exist" });

      if (user.otp_used)
        return res.status(400).json({ error: "OTP already used" });

      if (user.otp !== value.otp)
        return res.status(400).json({ error: "Incorrect OTP" });

      if (user.otp_expire_time < new Date())
        return res.status(400).json({ error: "OTP has been expired" });

      // Update password and reset OTP
      // Hash password
      const hash = generatePasswordHash(value.password);
      user.password = hash;
      user.salt = "argon";
      user.otp_used = true;
      user.otp = null;
      user.otp_expire_time = null;

      await user.save();

      const message = `Your password has been successfully updated.`;

      let options = {};

      const settings = await SMTPSettings.findOne({ where: { id: 1 } });

      if (settings) {
        options = {
          host: settings.smtp_server,
          port: settings.smtp_port,
          secure: settings.use_tls,
          auth: {
            user: settings.smtp_username,
            pass: settings.smtp_password,
          },
        };
      } else {
        options = {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: true,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
          },
        }
      }


      // Send email
      await sendEmail({
        options,
        to: user.email,
        subject: "Password Reset Confirmation",
        message,
      });

      return res
        .status(200)
        .json({ success: "Password has been successfully updated." });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  get_me: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password", "otp", "otp_expire_time", "opt_used"] }, // Exclude sensitive fields
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      return res.status(200).json({ success: "User fetched successfully.", user });
    } catch (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  update_me: async (req, res) => {
    try {
      // Define validation schema
      const schema = Joi.object({
        username: Joi.string().optional(),
        full_name: Joi.string().optional(),
        profile_picture: Joi.string().uri().optional(),
        email: Joi.string().email().optional(),
        firm_name: Joi.string().optional(),
        phone: Joi.number().optional(),
        address: Joi.string().optional(),
        city: Joi.string().optional(),
        state: Joi.string().optional(),
        zip: Joi.string().optional(),
        password: Joi.string().min(6).pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$&*]).*$")).optional(),
        oldPassword: Joi.string().min(6).pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$&*]).*$")).optional(),
      });

      const { error, value } = schema.validate(req.body);

      if (error) return res.status(400).json({ error: error.details[0].message });

      const user = await User.findByPk(req.user.id);

      if (!user) return res.status(404).json({ error: "User not found" });

      // ✅ Check if email or username already exists for other users
      if (value.email || value.username) {
        const existingUser = await User.findOne({
          where: {
            [Op.or]: [
              { email: value.email },
              { username: value.username },
            ],
            id: { [Op.ne]: req.user.id }, // Exclude current user from check
          },
        });

        if (existingUser) {
          return res.status(400).json({ error: "Email or username already in use" });
        }
      }

      // ✅ If updating password, verify old password first
      if (value.password && req.body.oldPassword) {
        const isMatch = verifyPassword(value.oldPassword, false, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect old password" });

        // Hash new password
        value.password = generatePasswordHash(value.password);
      }

      // ✅ Update user
      await user.update(value);

      return res.status(200).json({ success: "User updated successfully.", user });
    } catch (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "365d",
  });
};

module.exports = authCrtl;

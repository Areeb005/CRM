const Joi = require("joi");
const jwt = require("jsonwebtoken");
const {
  generatePasswordHash,
  verifyPassword,
  checkEmailAcrossModels,
  sendEmail,
} = require("../../helpers/functions");
const { User, ActivityLog, TblWebSettings } = require("../../models");
const { Op } = require("sequelize");

const authCrtl = {
  register: async (req, res) => {
    try {
      // Joi schema for validation (unchanged keys)
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
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Destructure validated data (unchanged keys)
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
        city,
      } = value;

      // Check if user already exists
      const existingUserEmail = await User.findOne({ where: { Email: email } }); // Map to model field
      if (existingUserEmail) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const existingUser = await User.findOne({ where: { UserName: username } }); // Map to model field
      if (existingUser) {
        return res.status(409).json({ error: "Username already registered" });
      }

      // Hash password
      const hash = generatePasswordHash(password);

      // Create user with model-compatible fields
      const newUser = await User.create({
        UserName: username,           // Map to model field
        PasswordHash: hash,          // Map to model field
        FullName: full_name,         // Map to model field
        Address: address,            // Map to model field
        City: city,                  // Map to model field
        State: state,                // Map to model field
        Zip: zip,                    // Map to model field
        Email: email,                // Map to model field
        FirmName: firm_name,         // Map to model field
        Phone: phone.toString(),     // Convert to string to match STRING(50)
        Role: "attorney",            // Map to model field (hardcoded as per original)
        AppAcctNo: app_acc_no ? app_acc_no.toString() : null, // Convert to string or null
        IsApproved: false,           // Default for new user (not in Joi, but required by model)
        IsDeleted: false,            // Default for new user (not in Joi, but required by model)
      });

      // Generate access token
      const access_token = createAccessToken({
        id: newUser.UserID,          // Map to model field
        role: newUser.Role,          // Map to model field
        username: newUser.UserName,  // Map to model field
      });

      // Log user registration (assuming ActivityLog model exists)
      await ActivityLog.create({
        user_id: newUser.UserID,     // Map to model field
        action_type: "user_registered",
        description: `New user registered with email {${email}} as {${newUser.Role}}.`,
      });

      // Return success response
      return res.status(200).json({
        success: "User registered successfully",
        access_token,
        data: newUser,
      });
    } catch (error) {
      console.error("Registration error:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  login: async (req, res) => {
    try {
      // Joi schema for validation
      const schema = Joi.object({
        username: Joi.string().required(), // Match model field name
        password: Joi.string().required(), // Match incoming request field
      });

      // Validate request body
      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { username, password } = value;

      const UserName = username;
      const Password = password;



      // Check if user exists
      let user = await User.findOne({
        where: { UserName }, // Match model field name
      });

      if (!user) {
        return res.status(404).json({ error: "User does not exist" });
      }

      // Verify password
      // Assuming verifyPassword takes (plainPassword, hashedPassword) and returns a boolean
      const isPasswordValid = verifyPassword(Password, false, user.PasswordHash);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      // Generate access token
      // Assuming createAccessToken takes an object with user details
      const access_token = createAccessToken({
        id: user.UserID, // Match model field name
        role: user.Role, // Match model field name
        username: user.UserName, // Match model field name
      });

      // Convert to JSON and remove sensitive data
      user = user.toJSON();
      delete user.PasswordHash; // Already excluded, but ensuring it’s not sent

      // Return success response
      return res.status(200).json({
        success: "Login successful",
        access_token,
        data: user,
      });
    } catch (error) {
      console.error("Login error:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      // Joi schema for validation
      const schema = Joi.object({
        email: Joi.string().email().required(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Find user by email (map to User model field)
      const user = await User.findOne({ where: { Email: value.email } });

      if (!user) {
        return res.status(400).json({ error: "Email does not exist" });
      }

      // Generate OTP and set expiration time
      const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
      const expireTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

      // Use existing User model fields instead of otp, otp_used, otp_expire_time
      user.LastToken = otp.toString(); // Store OTP in LastToken (STRING(100))
      user.LastTokenExpiry = expireTime; // Store expiration in LastTokenExpiry (DATE)

      await user.save();

      const message = `${otp} is your OTP for password reset. It will expire in 5 minutes.`;

      // SMTP settings retrieval (map to TblWebSettings model fields)
      let options = {};
      const settings = await TblWebSettings.findOne({ where: { WebSettingsID: 1 } }); // Use primary key WebSettingsID

      if (settings) {
        options = {
          host: settings.SMTPServer, // Map to model field
          port: settings.SMTPPort,   // Map to model field
          secure: settings.SMTPUseTLS, // Map to model field (BOOLEAN)
          auth: {
            user: settings.SMTPUserName, // Map to model field
            pass: settings.SMTPPassword, // Map to model field
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
        };
      }

      // Send email
      await sendEmail({
        options,
        to: user.Email, // Use User model field
        subject: "Password Reset OTP",
        message,
      });

      return res.status(200).json({
        success: "OTP has been sent to your email. Valid for 5 minutes.",
      });
    } catch (err) {
      console.error("Forgot password error:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  resetPassword: async (req, res) => {
    try {
      // Joi schema for validation
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
          .min(6)
          .pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$&*]).*$"))
          .required(),
        otp: Joi.string().min(6).max(6).required(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Find user by email (map to User model field)
      const user = await User.findOne({ where: { Email: value.email } });

      if (!user) {
        return res.status(400).json({ error: "Email does not exist" });
      }

      // Check OTP (using LastToken and LastTokenExpiry)
      if (user.LastToken !== value.otp) {
        return res.status(400).json({ error: "Incorrect OTP" });
      }

      if (user.LastTokenExpiry < new Date()) {
        return res.status(400).json({ error: "OTP has been expired" });
      }

      // Note: No otp_used field in the model, so skipping that check
      // If you need usage tracking, consider adding a field or using a separate table

      // Update password (map to PasswordHash)
      const hash = generatePasswordHash(value.password);
      user.PasswordHash = hash; // Map to model field
      user.LastToken = null; // Clear OTP
      user.LastTokenExpiry = null; // Clear expiry

      await user.save();

      const message = `Your password has been successfully updated.`;

      // SMTP settings retrieval (map to TblWebSettings model fields)
      let options = {};
      const settings = await TblWebSettings.findOne({ where: { WebSettingsID: 1 } }); // Use primary key

      if (settings) {
        options = {
          host: settings.SMTPServer, // Map to model field
          port: settings.SMTPPort,   // Map to model field
          secure: settings.SMTPUseTLS, // Map to model field (BOOLEAN)
          auth: {
            user: settings.SMTPUserName, // Map to model field
            pass: settings.SMTPPassword, // Map to model field
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
        };
      }

      // Send email
      await sendEmail({
        options,
        to: user.Email, // Use User model field
        subject: "Password Reset Confirmation",
        message,
      });

      return res.status(200).json({
        success: "Password has been successfully updated.",
      });
    } catch (err) {
      console.error("Reset password error:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  get_me: async (req, res) => {

    try {
      const user = await User.findByPk(req.user.id, {
        attributes: {
          exclude: ["PasswordHash"],
        },
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
        password: Joi.string()
          .min(6)
          .pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$&*]).*$"))
          .optional(),
        oldPassword: Joi.string()
          .min(6)
          .pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$&*]).*$"))
          .optional(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Find user by ID (map to User model field UserID)
      const user = await User.findByPk(req.user.id); // Assuming req.user.UserID from auth middleware

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if email or username already exists for other users
      if (value.email || value.username) {
        const existingUser = await User.findOne({
          where: {
            [Op.or]: [
              { Email: value.email }, // Map to model field
              { UserName: value.username }, // Map to model field
            ],
            UserID: { [Op.ne]: req.user.UserID }, // Exclude current user
          },
        });

        if (existingUser) {
          return res.status(400).json({ error: "Email or username already in use" });
        }
      }

      // If updating password, verify old password first
      if (value.password && req.body.oldPassword) {
        const isMatch = verifyPassword(req.body.oldPassword, user.PasswordHash); // Map to model field
        if (!isMatch) {
          return res.status(400).json({ error: "Incorrect old password" });
        }

        // Hash new password
        value.password = generatePasswordHash(value.password);
      }

      // Prepare update data with model field names
      const updateData = {};
      if (value.username) updateData.UserName = value.username;
      if (value.full_name) updateData.FullName = value.full_name;
      if (value.profile_picture) updateData.ProfilePicture = value.profile_picture; // Note: Not in model yet
      if (value.email) updateData.Email = value.email;
      if (value.firm_name) updateData.FirmName = value.firm_name;
      if (value.phone) updateData.Phone = value.phone.toString(); // Convert to string
      if (value.address) updateData.Address = value.address;
      if (value.city) updateData.City = value.city;
      if (value.state) updateData.State = value.state;
      if (value.zip) updateData.Zip = value.zip;
      if (value.password) updateData.PasswordHash = value.password; // Map to model field

      // Update user
      await user.update(updateData);

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

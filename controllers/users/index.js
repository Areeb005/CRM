const Joi = require("joi");
const { generatePasswordHash } = require("../../helpers/functions");
const { Op } = require("sequelize");
const { User } = require("../../models");


const usersCrtl = {
  create: async (req, res) => {
    try {

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
        app_acc_no: Joi.number().integer().required(),
        role: Joi.string()
          .valid("admin", "attorney")
          .required(),
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
        role,
        city
      } = value;

      // Check if user already exists
      const existingUserEmail = await User.findOne({ where: { email } });
      if (existingUserEmail)
        return res.status(409).json({ error: "Email already registered" });

      const existingUser = await User.findOne({ where: { username } });
      if (existingUser)
        return res.status(409).json({ error: "Email already registered" });

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
        role,
        city,
        status: true, // Default status
        created_by: req.user.id,
        updated_by: req.user.id,
      });


      // Return success response
      return res.status(200).json({
        success: "User registered successfully",
        data: newUser,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  get_all: async (req, res) => {
    try {
      const schema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        username: Joi.string().optional(),
        email: Joi.string().email().optional(),
        role: Joi.string().valid("admin", "attorney").optional(),
        status: Joi.boolean().optional(),
      });

      // Validate query parameters
      const { error, value } = schema.validate(req.query);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { page, limit, username, email, role, status } = value;

      // Calculate offset for pagination
      const offset = (page - 1) * limit;

      // Build dynamic filters using spread operator
      let whereConditions = {
        role: { [Op.ne]: "admin" }, // Exclude admin users by default
        ...(username ? { username: { [Op.like]: `%${username}%` } } : {}),
        ...(email ? { email: { [Op.like]: `%${email}%` } } : {}),
        ...(role ? { role } : {}),
        ...(status !== undefined ? { status } : {}),
      };

      // Fetch users with pagination and filters
      const { rows: users, count: totalUsers } = await User.findAndCountAll({
        attributes: { exclude: ["password"] }, // Exclude sensitive fields
        limit,
        offset,
        where: whereConditions,
      });

      return res.status(200).json({
        success: "Users fetched successfully",
        data: users,
        pagination: {
          totalUsers,
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          pageSize: limit,
        },
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  get_one: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.number().min(1).required(),
      });

      // Validate query parameters
      const { error, value } = schema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { id } = value;

      const user = await User.findOne({
        where: { id, role: { [Op.ne]: "admin" } },
        attributes: { exclude: ["password"] }, // Exclude sensitive fields
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        success: "User fetched successfully",
        data: user,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  update_one: async (req, res) => {
    try {
      const { role, id: updater_id } = req.user;

      // Authorization check - only admin can update users
      if (role !== "admin") {
        return res.status(403).json({ error: "Unauthorized action" });
      }

      // Joi schema for update validation
      const schema = Joi.object({
        username: Joi.string().min(1).max(255).optional(),
        full_name: Joi.string().min(1).max(255).optional(),
        profile_picture: Joi.string()
          .uri()
          .max(255)
          .optional(),
        email: Joi.string().email().optional(),
        password: Joi.string()
          .pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$"))
          .optional()
          .messages({
            "string.pattern.base":
              "Password must contain at least one uppercase letter, one special character, one number, and be at least 8 characters long.",
          }),
        firm_name: Joi.string().optional(),
        phone: Joi.number().integer().optional(),
        address: Joi.string().optional(),
        state: Joi.string().optional(),
        zip: Joi.string().optional(),
        city: Joi.string().optional(),
        app_acc_no: Joi.number().integer().optional(),
        role: Joi.string()
          .valid("admin", "attorney")
          .optional(),
        status: Joi.boolean().optional(),
        otp: Joi.string().optional(),
        opt_used: Joi.boolean().optional(),
        otp_expire_time: Joi.date().optional(),
      });

      // Validate request body
      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Get user ID from route params
      const { id } = req.params;

      // Find user to update
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check for unique fields conflicts
      if (value.email && value.email !== user.email) {
        const emailExists = await User.findOne({ where: { email: value.email } });
        if (emailExists) {
          return res.status(409).json({ error: "Email already in use" });
        }
      }

      if (value.username && value.username !== user.username) {
        const usernameExists = await User.findOne({ where: { username: value.username } });
        if (usernameExists) {
          return res.status(409).json({ error: "Username already taken" });
        }
      }

      // Hash new password if provided
      let updateData = { ...value };
      if (value.password) {
        updateData.password = generatePasswordHash(value.password);
      }

      // Add update metadata
      updateData.updated_by = updater_id;
      updateData.updatedAt = new Date();

      // Perform update
      const [affectedCount] = await User.update(updateData, {
        where: { id },
      });

      if (affectedCount === 0) {
        return res.status(400).json({ error: "No changes made" });
      }

      // Get updated user data
      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ["password"] }
      });

      return res.status(200).json({
        success: "User updated successfully",
        data: updatedUser
      });

    } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = usersCrtl;

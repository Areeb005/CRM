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
          .valid("Administrator", "attorney")
          .required(),
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
        city,
      } = value;

      // Check if user already exists
      const existingUserEmail = await User.findOne({ where: { Email: email } }); // Map to model field
      if (existingUserEmail) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const existingUser = await User.findOne({ where: { UserName: username } }); // Map to model field
      if (existingUser) {
        return res.status(409).json({ error: "Username already registered" }); // Fixed error message
      }

      // Hash password
      const hash = generatePasswordHash(password);

      // Create user with model-compatible fields
      const newUser = await User.create({
        UserName: username,           // Map to model field
        FullName: full_name,         // Map to model field
        // ProfilePicture: profile_picture, // Not in model; add if needed
        Email: email,                // Map to model field
        PasswordHash: hash,          // Map to model field
        FirmName: firm_name,         // Map to model field
        Phone: phone.toString(),     // Convert to string for STRING(50)
        Address: address,            // Map to model field
        State: state,                // Map to model field
        City: city,                  // Map to model field
        Zip: zip,                    // Map to model field
        AppAcctNo: app_acc_no.toString(), // Convert to string for STRING(50)
        Role: role == "Attorney" ? role.toLowerCase() : role,                  // Map to model field
        IsApproved: false,           // Default; not in Joi but required
        IsDeleted: false,            // Default; not in Joi but required
        CreatedUserID: req.user.UserID, // Map to model field; assumes req.user.UserID from auth
        // UpdatedBy not in model; use CreatedUserID if needed for audit
      });

      // Return success response
      return res.status(200).json({
        success: "User registered successfully",
        data: newUser,
      });
    } catch (error) {
      console.error("Error creating user:", error.message);
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
        role: Joi.string().valid("Administrator", "attorney").optional(),
        status: Joi.boolean().optional(), // will map to IsApproved
      });

      const { error, value } = schema.validate(req.query);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { page, limit, username, email, role, status } = value;
      const offset = (page - 1) * limit;

      // Map lowercase query params to PascalCase DB fields
      const whereConditions = {
        Role: { [Op.ne]: "Administrator" }, // exclude by default
        ...(username ? { UserName: { [Op.like]: `%${username}%` } } : {}),
        ...(email ? { Email: { [Op.like]: `%${email}%` } } : {}),
        ...(role ? { Role: role } : {}),
        ...(status !== undefined ? { IsApproved: status } : {}),
      };

      const { rows: users, count: totalUsers } = await User.findAndCountAll({
        where: whereConditions,
        attributes: {
          exclude: ["PasswordHash", "LastToken", "LastTokenExpiry"]
        },
        offset,
        limit,
        order: [["CreatedDate", "DESC"]],
      });

      return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
        pagination: {
          totalUsers,
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          pageSize: limit,
        },
      });
    } catch (err) {
      console.error("❌ Error fetching users:", err.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  get_one: async (req, res) => {
    try {
      const schema = Joi.object({
        id: Joi.number().min(1).required(),
      });

      const { error, value } = schema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { id } = value;

      const user = await User.findOne({
        where: {
          UserID: id,
          Role: { [Op.ne]: "Administrator" }, // Exclude admins
        },
        attributes: {
          exclude: ["PasswordHash", "LastToken", "LastTokenExpiry"],
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
      });
    } catch (error) {
      console.error("❌ Error fetching user:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  update_one: async (req, res) => {
    try {
      const { role, id: updater_id } = req.user;


      const schema = Joi.object({
        username: Joi.string().min(1).max(255).optional(),
        full_name: Joi.string().min(1).max(255).optional(),
        profile_picture: Joi.string().uri().max(255).optional(), // not in model but kept if needed
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
        role: Joi.string().valid("Administrator", "attorney").optional(),
        status: Joi.boolean().optional(), // maps to IsApproved maybe?
        otp: Joi.string().optional(), // not in model
        opt_used: Joi.boolean().optional(), // not in model
        otp_expire_time: Joi.date().optional(), // not in model
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check uniqueness for email & username
      if (value.email && value.email !== user.Email) {
        const emailExists = await User.findOne({ where: { Email: value.email } });
        if (emailExists) {
          return res.status(409).json({ error: "Email already in use" });
        }
      }

      if (value.username && value.username !== user.UserName) {
        const usernameExists = await User.findOne({ where: { UserName: value.username } });
        if (usernameExists) {
          return res.status(409).json({ error: "Username already taken" });
        }
      }

      // Prepare data to update
      const updateData = {
        ...(value.username && { UserName: value.username }),
        ...(value.full_name && { FullName: value.full_name }),
        ...(value.email && { Email: value.email }),
        ...(value.password && { PasswordHash: generatePasswordHash(value.password) }),
        ...(value.firm_name && { FirmName: value.firm_name }),
        ...(value.phone && { Phone: value.phone.toString() }), // Sequelize uses STRING
        ...(value.address && { Address: value.address }),
        ...(value.state && { State: value.state }),
        ...(value.zip && { Zip: value.zip }),
        ...(value.city && { City: value.city }),
        ...(value.app_acc_no && { AppAcctNo: value.app_acc_no.toString() }),
        ...(value.role && { Role: value.role === "admin" ? "Administrator" : "attorney" }),
        ...(value.status !== undefined && { IsApproved: value.status }),
        CreatedUserID: updater_id,
      };

      const [affectedCount] = await User.update(updateData, {
        where: { UserID: id },
      });

      if (affectedCount === 0) {
        return res.status(400).json({ error: "No changes made" });
      }

      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ["PasswordHash", "LastToken", "LastTokenExpiry"] },
      });

      return res.status(200).json({
        success: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Update error:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = usersCrtl;

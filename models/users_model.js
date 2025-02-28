const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const { generatePasswordHash } = require("../helpers/functions");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER, // Change to INTEGER
      autoIncrement: true, // Enable auto-increment
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://cdn-icons-png.flaticon.com/256/6522/6522516.png",
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    firm_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    app_acc_no: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM(
        "admin",
        "attorney",
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    opt_used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    otp_expire_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE", // Delete site if the creator user is deleted
      onUpdate: "CASCADE", // Update site if the creator user ID is updated
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE", // Delete site if the creator user is deleted
      onUpdate: "CASCADE", // Update site if the creator user ID is updated
    },
  },
  {
    tableName: "users", // Define table name explicitly
    timestamps: true,
  }
);


// 🔹 Function to create default admin if none exists
const createDefaultAdmin = async () => {
  try {
    // Check if an admin already exists
    const adminExists = await User.findOne({ where: { role: "admin" } });

    if (!adminExists) {
      // console.log("No admin found. Creating default Super Admin...");

      // Hash the default password
      const hashedPassword = await generatePasswordHash("Admin@123");

      // Create the Super Admin user
      await User.create({
        username: "superadmin",
        full_name: "Super Admin",
        profile_picture: "https://cdn-icons-png.flaticon.com/256/6522/6522516.png",
        email: "admin@attorneycrm.com",
        firm_name: "Admin Firm",
        phone: 1234567890, // Replace with a valid number
        address: "Admin Street, HQ",
        city: "Admin City",
        state: "Admin State",
        zip: "00000",
        password: hashedPassword,
        role: "admin", // Set as Admin
        status: true, // Active Admin
        created_by: null, // Created by system
        updated_by: null,
      });

      // console.log("✅ Default Super Admin created successfully!");
    } else {
      // console.log("Super Admin already exists.");
    }
  } catch (error) {
    console.error("❌ Error creating Super Admin:", error);
  }
};

sequelize.sync().then(createDefaultAdmin);


module.exports = User;




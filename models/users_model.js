const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

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

module.exports = User;

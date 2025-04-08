const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/dbConfig");

const User = sequelize.define("User", {
  UserID: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  UserName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  PasswordHash: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  FullName: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  Address: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  City: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  State: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Zip: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  Email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  FirmName: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  Phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Role: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  AppAcctNo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  IsApproved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  ApproveDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ApproveUserID: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  CreatedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('(getdate())') // 👈 tell Sequelize to NOT mess with it
  },
  CreatedUserID: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  IsDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  DeletedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  DeleteUserID: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  LastToken: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  LastTokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: "tblUsers", // ❌ remove dbo.
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false,
  freezeTableName: true,
  createdAt: false,
  updatedAt: false,
  underscored: false,
});

module.exports = User;



const { generatePasswordHash } = require("../helpers/functions");

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ where: { Role: "Administrator" } });

    if (!adminExists) {
      const hashedPassword = generatePasswordHash("Admin@123");

      await User.create({
        UserName: "superadmin",
        PasswordHash: hashedPassword,
        FullName: "Super Admin",
        Address: "Admin Street, HQ",
        City: "Admin City",
        State: "Admin State",
        Zip: "00000",
        Email: "admin@attorneycrm.com",
        FirmName: "Admin Firm",
        Phone: "1234567890",
        Role: "Administrator",
        AppAcctNo: "1001",
        CreatedDate: new Date().toISOString().replace('T', ' ').substring(0, 23), // yyyy-mm-dd hh:mm:ss.mmm
        IsApproved: true,
        IsDeleted: false
      });

      console.log("✅ Default Super Admin created.");
    } else {
      console.log("Super Admin already exists.");
    }
  } catch (err) {
    console.error("❌ Failed to create admin:", err);
  }
};

sequelize.authenticate().then(() => {
  createDefaultAdmin(); // Only create admin if DB is reachable
}).catch(err => {
  console.error("❌ Database connection failed:", err);
});
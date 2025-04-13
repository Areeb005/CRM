const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const TblWebSettings = sequelize.define("TblWebSettings", {
  WebSettingsID: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  SMTPServer: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  SMTPPort: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  SMTPUserName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  SMTPPassword: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  SMTPUseTLS: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  OrganizationName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  OrganizationContact: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  OrganizationWebsite: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  OrganizationLogo: {
    type: DataTypes.STRING(4000),
    allowNull: true
  },
  NotificationMail: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: "tblWebSettings",
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false
});

module.exports = TblWebSettings;

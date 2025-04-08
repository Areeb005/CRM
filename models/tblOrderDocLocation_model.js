const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const TblOrderDocLocation = sequelize.define("TblOrderDocLocation", {
  OrderDocLocationID: {
    type: DataTypes.BIGINT,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  OrderID: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  LocationID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  LocationName: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  LocationAddress: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  LocationCity: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  LocationState: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  LocationZip: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  ProcessType: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  RecordType: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  Action: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  CopyForReview: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  Note: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  DocFilePath: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  Uploaded: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  UploadDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  UploadUserID: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  Downloaded: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  LatestDownloadDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  LatestDownloadUserID: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  DocRequestStatus: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  CancelDocRequestDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  CancelDocRequestUserID: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  CancelDocApproveDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  CancelDocApproveUserID: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  CancelDocRejectDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  CancelDocRejectUserID: {
    type: DataTypes.BIGINT,
    allowNull: true
  }
}, {
  tableName: "tblOrderDocLocation",
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false
});

module.exports = TblOrderDocLocation;

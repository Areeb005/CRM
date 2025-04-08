const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const TStatus = sequelize.define("TStatus", {
  status_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  driver: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  clientstatus: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  partno: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  FieldAction: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  whereisit: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  StatusType: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  MileStone: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  ProcessStatus: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ShowToClient: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  Voided: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  VoidedByID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  DateVoided: {
    type: DataTypes.DATE,
    allowNull: true
  },
  WCABAutoInvoice: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: "tstatus",
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false
});

module.exports = TStatus;

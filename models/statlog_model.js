const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Statlog = sequelize.define("Statlog", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  statype: {
    type: DataTypes.CHAR(1),
    allowNull: false
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  statdate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  record_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  forWhom: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  inputdate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  voided: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  voidedby: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  datevoided: {
    type: DataTypes.DATE,
    allowNull: true
  },
  Notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: "statlog",
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false
});

module.exports = Statlog;

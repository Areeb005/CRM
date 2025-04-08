const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const ProcAction = sequelize.define("ProcAction", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  Action: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  AFilter: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: "ProcAction", // Make sure to match full SQL Server table name
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false
});

module.exports = ProcAction;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Represent = sequelize.define("Represent", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  crossit: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  representing: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  attyfor: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "Represent",
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false
});

module.exports = Represent;

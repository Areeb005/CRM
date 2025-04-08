const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Pschedul = sequelize.define("Pschedul", {
  sched_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  sched_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: "pschedul",
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false
});

module.exports = Pschedul;

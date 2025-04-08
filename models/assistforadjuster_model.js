const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Adjuster = require("./adjuster_model");
const Assistant = require("./assistants_model");

const AssistForAdjuster = sequelize.define("AssistForAdjuster", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  assistantid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Assistant,
      key: "id"
    }
  },
  adjuster_no: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Adjuster,
      key: "adjuster_no"
    }
  }
}, {
  tableName: "assistforadjuster",
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false
});

module.exports = AssistForAdjuster;

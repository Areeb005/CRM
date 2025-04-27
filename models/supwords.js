const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Supword = sequelize.define("Supword", {
  Word_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  Word_Name: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  Words: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Employment: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Attach3Type: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  WordDocID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  PDFFileName: {
    type: DataTypes.STRING(200),
    allowNull: true
  }
}, {
  tableName: "supwords",
  schema: "dbo",
  timestamps: false
});

module.exports = Supword;

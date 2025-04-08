const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const CaseType = sequelize.define("CaseType", {
  casetypeid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  casename: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  arbitration: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  lallowfilling: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  defdays: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Penalty: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  interest: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: "casetype",
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false
});

module.exports = CaseType;

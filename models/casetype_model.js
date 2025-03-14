const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const CaseType = sequelize.define("CaseType", {
  casetypeid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  casename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  arbitration: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
  },
  lallowfilling: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
  },
  defdays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  Penalty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  interest: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: "casetype",
  timestamps: false, // No createdAt/updatedAt columns
});

module.exports = CaseType;

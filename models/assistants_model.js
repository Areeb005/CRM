const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Customer = require("./customer_model");

const Assistants = sequelize.define("Assistants", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  acctno: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: "acctno"
    }
  },
  first_name: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  middle_name: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  phone: {
    type: DataTypes.CHAR(14),
    allowNull: true
  },
  fax: {
    type: DataTypes.CHAR(14),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  assistype: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  salut: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: "assistants",
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false
});

module.exports = Assistants;

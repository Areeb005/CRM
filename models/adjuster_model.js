const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Customer = require('./customer_model'); // FK: acctno

const Adjuster = sequelize.define('Adjuster', {
  adjuster_no: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  acctno: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'acctno'
    }
  },
  adjuster_last: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  adjuster_first: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  adjuster_middle: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  adjuster_salut: {
    type: DataTypes.STRING(25),
    allowNull: true
  },
  adjuster_phone: {
    type: DataTypes.STRING(14),
    allowNull: true
  },
  adjuster_ext: {
    type: DataTypes.STRING(6),
    allowNull: true
  },
  adjuster_fax: {
    type: DataTypes.STRING(14),
    allowNull: true
  },
  barno: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  isattorney: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  account: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  charting: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  pagination: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  indexing: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  webprint: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  billattach: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  sendemailto: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  eNotify: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  NeedCD: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  NeedPaper: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  WebAccount: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'adjuster',
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false
});

module.exports = Adjuster;

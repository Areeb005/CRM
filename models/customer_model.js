const { DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Customer = sequelize.define('Customer', {
  acctno: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  locatid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  custcode: {
    type: DataTypes.STRING(15),
    allowNull: true,
    unique: true
  },
  sched_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  customers_phone: {
    type: DataTypes.CHAR(14),
    allowNull: true
  },
  customers_ext: {
    type: DataTypes.CHAR(5),
    allowNull: true
  },
  customers_fax: {
    type: DataTypes.CHAR(14),
    allowNull: true
  },
  customers_contact: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  payterms: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  creditline: {
    type: DataTypes.DECIMAL(19, 4), // SQL "money"
    allowNull: true
  },
  cust_type: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sales_tax: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true
  },
  assignto: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  county: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  salespersid: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  },
  website: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  mailingid: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  acctghold: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  querytype: {
    type: DataTypes.TINYINT,
    allowNull: true,
    comment: '1-customer, 2-customer & lawyer, 3-lawyer only'
  },
  colnotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  timestamp_column: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  acctingemail: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  regemail: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  acctingcontact: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  idsource: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: UUIDV4() // ✅ will generate UUID once when model is loaded

  },
  colassignedto: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  addPI: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  addPenalty: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  WebUploadAcct: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'customer',
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false
});

module.exports = Customer;

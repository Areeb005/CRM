const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Location = require('./location_model');

const Customer = sequelize.define('Customer', {
  acctno: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  locatid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Location,
      key: 'locatid'
    }
  },
  custcode: {
    type: DataTypes.STRING(15),
    allowNull: true,
    unique: true,
  },
  sched_id: DataTypes.INTEGER,
  customers_phone: DataTypes.STRING(14),
  customers_ext: DataTypes.STRING(5),
  customers_fax: DataTypes.STRING(14),
  customers_contact: DataTypes.STRING(30),
  payterms: DataTypes.INTEGER,
  creditline: DataTypes.DECIMAL(19, 4),
  cust_type: DataTypes.INTEGER,
  sales_tax: DataTypes.DECIMAL(4, 2),
  assignto: DataTypes.INTEGER,
  county: DataTypes.INTEGER,
  salespersid: DataTypes.INTEGER,
  active: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 1,
  },
  website: DataTypes.STRING(50),
  mailingid: DataTypes.INTEGER,
  acctghold: DataTypes.TINYINT,
  querytype: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: true,
    comment: '1-customer, 2-customer & lawyer, 3-lawyer only'
  },
  colnotes: DataTypes.TEXT,
  note: DataTypes.TEXT,
  timestamp_column: DataTypes.BLOB,
  acctingemail: DataTypes.STRING(100),
  regemail: DataTypes.STRING(100),
  acctingcontact: DataTypes.STRING(100),
  idsource: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: sequelize.fn('uuid')
  },
  colassignedto: DataTypes.INTEGER,
  addPI: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  },
  addPenalty: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  },
  WebUploadAcct: DataTypes.STRING(50)
}, {
  tableName: 'customer',
  timestamps: false
});



module.exports = Customer;

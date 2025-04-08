const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig'); // adjust path if needed

const Orders = sequelize.define('Orders', {
  orderno: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  acctno: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  orderdate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duedate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duedatetyp: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  adjuster_no: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  claimant_last: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  claimant_first: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  claimant_middle: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  claimant_dob: {
    type: DataTypes.DATE,
    allowNull: true
  },
  claimant_ssn: {
    type: DataTypes.CHAR(11),
    allowNull: true
  },
  claimant_doi: {
    type: DataTypes.DATE,
    allowNull: true
  },
  caseno: {
    type: DataTypes.STRING(76),
    allowNull: true
  },
  casetype: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  claimno: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  fileno: {
    type: DataTypes.STRING(40),
    allowNull: true
  },
  defendent: {
    type: DataTypes.STRING(70),
    allowNull: true
  },
  plaintiff: {
    type: DataTypes.STRING(70),
    allowNull: true
  },
  nbr_of_location: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  billfirmid: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  billattnid: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sales_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  ordtrackin: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  representing: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  court_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  insured: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  filing_district: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  court_room: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  judge: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  ctrauma: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  cros: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  assistid: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  court_dept: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  employerid: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  InvCopyToEmployer: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  NotifyEmployer: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  claimantaddress: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  claimantcity: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  claimantstate: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  Claimantzip: {
    type: DataTypes.STRING(5),
    allowNull: true
  },
  Claimant_DOIEnds: {
    type: DataTypes.DATE,
    allowNull: true
  },
  InvoiceFile: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  OriginalBillDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  InitialDateOfService: {
    type: DataTypes.DATE,
    allowNull: true
  },
  SIBTF: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  tableName: 'orders',
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false
});

module.exports = Orders;

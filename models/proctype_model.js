const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Proctype = sequelize.define("Proctype", {
  processid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  procname: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  casetypeid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rectype: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  sdtdate: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  wcabcaseno: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  recboxes: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  page3status: {
    type: DataTypes.TINYINT,
    allowNull: false
  },
  asvboxes: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  wcabrequest: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  lallowsdt1: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  lallowsdt2: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  lallowrte: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  lallowattach: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  lallowdecl: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  lallowcopy: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  incopcounsel: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  distribute: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  page3title: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  userprocname: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  PlaceType: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  proofofservdoc: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lallowsdt4: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  NeedCourt: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  Sdt1Label: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Sdt2Label: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Sdt4Label: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  SdtDateLabel: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: "proctype",
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false
});

module.exports = Proctype;

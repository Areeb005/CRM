const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const CaseType = require("./casetype_model"); // Import CaseType model

const Proctype = sequelize.define("Proctype", {
  processid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  procname: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  casetypeid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CaseType, // Reference to CaseType model
      key: "casetypeid",
    },
  },
  rectype: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  sdtdate: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  wcabcaseno: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  recboxes: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  page3status: {
    type: DataTypes.TINYINT(3).UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  asvboxes: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  webrequest: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  lallowsdt1: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  lallowsdt2: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  lallowrte: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  lallowatch: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  lallowdecl: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  lallowcopy: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  incopounsel: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  distribute: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  page3title: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  userprocname: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  PlaceType: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "1 - compname, 2 - depos place, 3 - court",
  },
  proofofservice: {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  },
  lallowsdt4: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  NeedCourt: {
    type: DataTypes.TINYINT(4),
    allowNull: false,
    defaultValue: 0,
  },
  Sdt1Label: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  Sdt2Label: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  Sdt3Label: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  SdtDateLabel: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  tableName: "proctype",
  timestamps: false, // No createdAt/updatedAt columns
});

module.exports = Proctype;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");


const Reclocat = sequelize.define('Reclocat', {
  record_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  orderno: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'dbo.orders',
      key: 'orderno'
    }
  },
  location_nbr: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  locatid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sdt_datetime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  location_order_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  location_due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  location_due_type: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  oppcounsel: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  location_contact: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  servedtype: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  served_person: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  service_type: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  service_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  servicing_person: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  copy_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  copy_contact: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  copy_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  copy_type: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  copier_person: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  copy_picked_by: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  record_type: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  proc_type: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  status_iddate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  locallback: {
    type: DataTypes.DATE,
    allowNull: true
  },
  hearphone: {
    type: DataTypes.CHAR(14),
    allowNull: true
  },
  locsdtinst: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  locpg2inst: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  locrteinst: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  geninst: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  declmailtoinst: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  loctrackin: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sdt2page: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  prodstatus: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  wcab_caseno: {
    type: DataTypes.STRING(76),
    allowNull: true
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  date_assigned: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deptid: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  dept_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  apointmentfrom: {
    type: DataTypes.DATE,
    allowNull: true
  },
  apointmentto: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  onhold: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  OnHoldDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  stenography: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  audiotape: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  videotape: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  videofortrial: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  instvideodisplay: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  printstatus: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  indexing: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  holdstatusid: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  DSToDriver: {
    type: DataTypes.DATE,
    allowNull: true
  },
  servicerid: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sdt4page: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  foldercreated: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  Action: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  AuthoAttached: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  TagColor: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  CreatedByID: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'reclocat',
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false
});

module.exports = Reclocat;

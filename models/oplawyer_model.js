const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Orders = require('./orders_model'); // FK: orderno

const Oplawyer = sequelize.define('Oplawyer', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  orderno: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Orders,
      key: 'orderno'
    }
  },
  firmid: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  attyid: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cocounsel: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  representid: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Entityrepresented: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  InvCopyToCoCounsel: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  tableName: 'oplawyer',
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false
});

module.exports = Oplawyer;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Order = require("./order_model");

const Participant = sequelize.define("Participant", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  represents: DataTypes.STRING,
  phone: DataTypes.STRING,
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  zip: DataTypes.STRING,
  claim: DataTypes.STRING,
  adjuster: DataTypes.STRING,
  note: DataTypes.TEXT,
  order_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "orders",
      key: "id"
    }
  }
}, {
  tableName: "participants",
  timestamps: true
});


// Participant.belongsTo(Order, { foreignKey: "order_id" });



module.exports = Participant;
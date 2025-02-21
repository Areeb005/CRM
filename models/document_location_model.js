const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Order = require("./order_model");

const DocumentLocation = sequelize.define("DocumentLocation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: DataTypes.STRING,
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  zip: DataTypes.STRING,
  process_type: DataTypes.STRING,
  record_type: DataTypes.STRING,
  action: DataTypes.STRING,
  review_request: DataTypes.BOOLEAN,
  files: DataTypes.JSON, // Array of file paths
  note: DataTypes.TEXT,
  order_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "orders",
      key: "id"
    }
  }
}, {
  tableName: "document_locations",
  timestamps: true
});


// DocumentLocation.belongsTo(Order, { foreignKey: "order_id" });



module.exports = DocumentLocation;
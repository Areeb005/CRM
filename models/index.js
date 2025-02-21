const sequelize = require("../config/dbConfig");
const User = require("./users_model");
const Order = require("./order_model");
const Participant = require("./participant_model");
const DocumentLocation = require("./document_location_model");

// Define Associations
Order.belongsTo(User, { foreignKey: "updated_by" });
Order.belongsTo(User, { foreignKey: "created_by" });
Order.belongsTo(User, { foreignKey: "order_by" });

Order.hasMany(Participant, { foreignKey: "order_id" });
Participant.belongsTo(Order, { foreignKey: "order_id" });

Order.hasMany(DocumentLocation, { foreignKey: "order_id" });
DocumentLocation.belongsTo(Order, { foreignKey: "order_id" });

module.exports = {
    User,
    Order,
    Participant,
    DocumentLocation,
};

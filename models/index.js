const sequelize = require("../config/dbConfig");
const User = require("./users_model");
const Order = require("./order_model");
const Participant = require("./participant_model");
const DocumentLocation = require("./document_location_model");
const ActivityLog = require("./logs_model");

// Define Associations
Order.belongsTo(User, { foreignKey: "order_by", as: "orderByUser" });
Order.belongsTo(User, { foreignKey: "created_by", as: "createdByUser" });
Order.belongsTo(User, { foreignKey: "updated_by", as: "updatedByUser" });

Order.hasMany(Participant, { foreignKey: "order_id" });
Participant.belongsTo(Order, { foreignKey: "order_id" });

Order.hasMany(DocumentLocation, { foreignKey: "order_id" });
DocumentLocation.belongsTo(Order, { foreignKey: "order_id" });

// Associations
ActivityLog.belongsTo(User, { foreignKey: "user_id", as: "user" });
ActivityLog.belongsTo(User, { foreignKey: "related_user_id", as: "relatedUser" });
ActivityLog.belongsTo(Order, { foreignKey: "order_id", as: "order" });

module.exports = {
    User,
    Order,
    Participant,
    DocumentLocation,
    ActivityLog
};

const sequelize = require("../config/dbConfig");
const User = require("./tblUsers_model");
const TblOrder = require("./tblOrder_model");
const tblOrderCaseParties = require("./tblOrderCaseParties_model");
const ActivityLog = require("./logs_model");
const Location = require("./location_model");
const Customer = require("./customer_model");
const Court = require("./court_model");
const CaseType = require("./casetype_model");
const Reclocat = require("./reclocat_model");
const Orders = require("./orders_model");
const Adjuster = require("./adjuster_model");
const Oplawyer = require("./oplawyer_model");
const Represent = require("./Represent_model");
const TblOrderDocLocation = require("./tblOrderDocLocation_model");
const Pschedul = require("./pschedul_model");
const Assistants = require("./assistants_model");
const AssistForAdjuster = require("./assistforadjuster_model");
const ProcAction = require("./ProcAction_model");
const Proctype = require("./proctype_model");
const Statlog = require("./StatLog_model");
const TblWebSettings = require("./tblWebsettings_model");
const TStatus = require("./tstatus_model");


// // Define Associations
// Order.belongsTo(User, { foreignKey: "order_by", as: "orderByUser" });
// Order.belongsTo(User, { foreignKey: "created_by", as: "createdByUser" });
// Order.belongsTo(User, { foreignKey: "updated_by", as: "updatedByUser" });

// Order.hasMany(Participant, { foreignKey: "order_id" });
// Participant.belongsTo(Order, { foreignKey: "order_id" });

// Order.hasMany(DocumentLocation, { foreignKey: "order_id" });
// DocumentLocation.belongsTo(Order, { foreignKey: "order_id" });

// // Associations
// ActivityLog.belongsTo(User, { foreignKey: "user_id", as: "user" });
// ActivityLog.belongsTo(User, { foreignKey: "related_user_id", as: "relatedUser" });
// ActivityLog.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// // Define Customer Relation
// Customer.belongsTo(Location, { foreignKey: 'locatid', as: 'location' });
// Location.hasMany(Customer, { foreignKey: 'locatid', as: 'customers' });

// // Define Court relationship
// Court.belongsTo(Location, { foreignKey: "locatid", as: "location" });

Reclocat.belongsTo(Orders, { foreignKey: 'orderno' });
Orders.hasMany(Reclocat, { foreignKey: 'orderno' });

// reclocat → order
Reclocat.belongsTo(Orders, { foreignKey: 'orderno' });
Orders.hasMany(Reclocat, { foreignKey: 'orderno' });

// order → customer
Orders.belongsTo(Customer, { foreignKey: 'acctno' });
Customer.hasMany(Orders, { foreignKey: 'acctno' });

// oplawyer → order
Oplawyer.belongsTo(Orders, { foreignKey: 'orderno' });
Orders.hasMany(Oplawyer, { foreignKey: 'orderno' });

// court → location
Court.belongsTo(Location, { foreignKey: 'locatid', targetKey: 'locatid' });
Location.hasMany(Court, { foreignKey: 'locatid', sourceKey: 'locatid' });

// customer → location
Customer.belongsTo(Location, { foreignKey: 'locatid', targetKey: 'locatid' });
Location.hasMany(Customer, { foreignKey: 'locatid', sourceKey: 'locatid' });

// customer → pschedul
Pschedul.hasMany(Customer, { foreignKey: "sched_id" });
Customer.belongsTo(Pschedul, { foreignKey: "sched_id" });

// adjuster → customer
Adjuster.belongsTo(Customer, { foreignKey: 'acctno' });
Customer.hasMany(Adjuster, { foreignKey: 'acctno' });

// assistants → customer
Assistants.belongsTo(Customer, { foreignKey: 'acctno' });
Customer.hasMany(Assistants, { foreignKey: 'acctno' });

// assistforadjuster → adjuster, assistant
AssistForAdjuster.belongsTo(Adjuster, { foreignKey: 'adjuster_no' });
Adjuster.hasMany(AssistForAdjuster, { foreignKey: 'adjuster_no' });
AssistForAdjuster.belongsTo(Assistants, { foreignKey: 'assistantid' });
Assistants.hasMany(AssistForAdjuster, { foreignKey: 'assistantid' });

// represent and case party
tblOrderCaseParties.belongsTo(TblOrder, { foreignKey: "OrderID" });
tblOrderCaseParties.belongsTo(Represent, { foreignKey: "RepresentID" });

// order doc location
TblOrderDocLocation.belongsTo(TblOrder, { foreignKey: "OrderID" });
TblOrderDocLocation.belongsTo(Location, { foreignKey: "LocationID" });


TblOrder.hasMany(tblOrderCaseParties, { foreignKey: "OrderID" });
TblOrder.hasMany(TblOrderDocLocation, { foreignKey: "OrderID" });

TblOrder.belongsTo(User, { foreignKey: "UserID", as: "orderByUser" });
TblOrder.belongsTo(User, { foreignKey: "CreatedUserID", as: "createdByUser" });


// Statlog_model.js
Statlog.belongsTo(TStatus, { foreignKey: 'Status_ID' });
TStatus.hasMany(Statlog, { foreignKey: 'Status_ID' });

// Connect Statlog with TblOrderDocLocation
Statlog.belongsTo(TblOrderDocLocation, { foreignKey: 'Record_ID', targetKey: 'RecordID' });
TblOrderDocLocation.hasMany(Statlog, {
    foreignKey: 'Record_ID',
    sourceKey: 'RecordID',
    as: 'statusLogs'
});


module.exports = {
    User,
    tblOrderCaseParties,
    TblOrderDocLocation,
    ActivityLog,
    Location,
    Customer,
    Court,
    CaseType,
    Proctype,
    Reclocat,
    Orders,
    Oplawyer,
    Adjuster,
    TblOrder,
    Assistants,
    AssistForAdjuster,
    Pschedul,
    ProcAction,
    Represent,
    Statlog,
    TblWebSettings,
    TStatus
};

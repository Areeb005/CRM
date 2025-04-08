const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./tblUsers_model");
const TblOrder = require("./tblOrder_model");

const ActivityLog = sequelize.define(
    "ActivityLog",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        action_type: {
            type: DataTypes.ENUM(
                "order_created",
                "order_started",
                "order_completed",
                "order_deadline_missed",
                "order_cancelled",
                "order_cancellation_accepted",
                "order_cancellation_rejected",
                "user_registered",
                "user_approved"
            ),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.BIGINT,
            references: {
                model: User,
                key: "UserID",
            },
            allowNull: true,
        },
        related_user_id: {
            type: DataTypes.BIGINT,
            references: {
                model: User,
                key: "UserID",
            },
            allowNull: true,
        },
        order_id: {
            type: DataTypes.BIGINT,
            references: {
                model: TblOrder,
                key: "OrderID",
            },
            allowNull: true,
        },
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "activity_logs",
        schema: "dbo",         // ✅ specify schema separately
        timestamps: true,
    }
);



module.exports = ActivityLog;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const User = require("./users_model");
const Order = require("./order_model");

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
            type: DataTypes.INTEGER,
            references: {
                model: "users",
                key: "id",
            },
            allowNull: true,
        },
        related_user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "users",
                key: "id",
            },
            allowNull: true,
        },
        order_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "orders",
                key: "id",
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
        timestamps: true,
    }
);



module.exports = ActivityLog;

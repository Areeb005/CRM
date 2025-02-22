const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Organization = sequelize.define(
    "Organization",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        organization_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        organization_contact: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        organization_website: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        notification_email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        favicon: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "organization_settings",
        timestamps: true,
    }
);

module.exports = Organization;

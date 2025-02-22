const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const SMTPSettings = sequelize.define(
    "SMTPSettings",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        smtp_server: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        smtp_port: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        smtp_username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        smtp_password: {
            type: DataTypes.STRING, // Store encrypted, never plaintext
            allowNull: false,
        },
        use_tls: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "smtp_settings",
        timestamps: true,
    }
);

module.exports = SMTPSettings;

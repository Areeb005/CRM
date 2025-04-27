const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Location = sequelize.define("Location", {
    locatid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    locat_name: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    locat_contact: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "CUSTODIAN OF RECORDS"
    },
    locat_address: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    locat_city: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    locat_state: {
        type: DataTypes.STRING(2),
        allowNull: true
    },
    locat_zip: {
        type: DataTypes.STRING(5),
        allowNull: true
    },
    zip4: {
        type: DataTypes.STRING(4),
        allowNull: true,
    },
    locat_phone: {
        type: DataTypes.STRING(14),
        allowNull: true
    },
    locat_ext: {
        type: DataTypes.STRING(6),
        allowNull: true,
    },
    locat_fax: {
        type: DataTypes.STRING(14),
        allowNull: true
    },
    locat_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
    },
    locat_notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    locat_shours: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    locat_chours: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    officeid: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    acceptfax: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    countyid: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    locat_type: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    universalname: {
        type: DataTypes.STRING(70),
        allowNull: true
    },
    badlocation: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    locat_code: {
        type: DataTypes.STRING(15),
        allowNull: true
    }
}, {
    tableName: "location", // Matches SQL Server's table name exactly
    schema: "dbo",         // ✅ specify schema separately
    timestamps: false,
    hasTrigger: true,
    modelName: "Location",
});

module.exports = Location;

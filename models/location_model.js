const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Location = sequelize.define("Location", {
    locatid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
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
        defaultValue: "    " // 4 spaces (adjust if needed)
    },
    locat_phone: {
        type: DataTypes.STRING(14),
        allowNull: true
    },
    locat_ext: {
        type: DataTypes.STRING(6),
        allowNull: true,
        defaultValue: "     " // 5 spaces (adjust if needed)
    },
    locat_fax: {
        type: DataTypes.STRING(14),
        allowNull: true
    },
    locat_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 15.00
    },
    locat_notes: {
        type: DataTypes.TEXT("long"),
        allowNull: true
    },
    locat_shours: {
        type: DataTypes.TEXT("long"),
        allowNull: true
    },
    locat_chours: {
        type: DataTypes.TEXT("long"),
        allowNull: true
    },
    officeid: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    acceptfax: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 0
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
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    locat_code: {
        type: DataTypes.STRING(15),
        allowNull: true
    }
}, {
    tableName: "location", // Ensure this matches your DB table name
    timestamps: false // Disable createdAt/updatedAt if not needed
});


module.exports = Location;
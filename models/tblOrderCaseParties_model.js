const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const tblOrderCaseParties = sequelize.define("tblOrderCaseParties", {
    OrderCasePartiesID: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    OrderID: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    PartyID: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    PartyName: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    PartyType: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    RepresentID: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    PartyPhone: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    PartyAddress: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    PartyCity: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    PartyState: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    PartyZip: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    OpposingAttorney: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    InsuranceClaim: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    InsuranceAdjuster: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Note: {
        type: DataTypes.STRING(500),
        allowNull: true
    }
}, {
    tableName: "tblOrderCaseParties",
    schema: "dbo",         // ✅ specify schema separately
    timestamps: false
});

module.exports = tblOrderCaseParties;

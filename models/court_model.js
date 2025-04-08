const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Location = require("./location_model"); // FK: locatid

const Court = sequelize.define("Court", {
    court_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    court_type: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    locatid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Location,
            key: "locatid"
        }
    },
    CourtTypeId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    branchid: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: "courts",
    schema: "dbo",         // ✅ specify schema separately
    timestamps: false
});

module.exports = Court;

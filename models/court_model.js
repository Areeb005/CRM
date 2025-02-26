const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig"); // Adjust based on your project setup
const Location = require("./location_model"); // Import the Location model

const Court = sequelize.define("Court", {
    court_id: {
        type: DataTypes.INTEGER,
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
          key: 'locatid'
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
    tableName: "courts", // Ensure it matches your database table name
    timestamps: false // Disable timestamps if your table doesn't have createdAt/updatedAt
});


// Export the model
module.exports = Court;

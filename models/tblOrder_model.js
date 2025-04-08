const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/dbConfig");

const TblOrder = sequelize.define("TblOrder", {
  OrderID: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  OrderCode: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  UserID: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  IsRush: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  NeededBy: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  CaseTypeID: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  BillToID: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  BillTo: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  CaseName: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  FileNumber: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  CaseNumber: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  CourtID: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  CourtName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  CourtAddress: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  CourtCity: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  CourtState: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  CourtZip: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  RecordType: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  PFirstName: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  PLastName: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  PAddress: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  PCity: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  PState: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  PZip: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  PSSN: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  PAKA: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  EName: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  EAddress: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  ECity: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  EState: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  EZip: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  DateOfIncident: {
    type: DataTypes.DATE,
    allowNull: false
  },
  DateTill: {
    type: DataTypes.DATE,
    allowNull: true
  },
  RequestStatus: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: "NEW"
  },
  CreatedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  CreatedUserID: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  CompletedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  AppOrderID: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  AppOrderIDUpdateDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  AppOrderIDUpdateUserID: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  LastReviewScore: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  LastReviewDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  LastReviewUserID: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  CancelRequestDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  CancelRequestUserID: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  CancelApproveDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  CancelApproveUserID: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  CancelRejectDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  CancelRejectUserID: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  CreatedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('(getdate())') // 👈 tell Sequelize to NOT mess with it
  },
  record_details: {
    type: DataTypes.STRING(4000), // ✅ Correctly defines an NVARCHAR(4000)
    allowNull: true,
    get() {
      const rawValue = this.getDataValue("record_details");
      try {
        return JSON.parse(rawValue);
      } catch {
        return null;
      }
    },
    set(value) {
      this.setDataValue("record_details", JSON.stringify(value));
    }
  }
}, {
  tableName: "tblOrder",
  schema: "dbo",         // ✅ specify schema separately
  timestamps: false // Disable if you're not using createdAt/updatedAt
});

module.exports = TblOrder;

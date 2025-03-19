const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");


const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Order By Section

    order_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM(
        "Active",
        // "In Progress",
        "Completed",
        // "Pending_Cancellation",
        "Cancelled",
        // "Hold"
      ),
      allowNull: false,
      defaultValue: "Active",
    },

    cancellation_requested: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // attorney_name: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // firm_name: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // order_by_email: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // order_by_phone: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    // order_by_address: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // order_by_city: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // order_by_state: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // order_by_zip: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },

    // Case Details Section
    urgent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    needed_by: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    case_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    case_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    claim_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    case_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Court Details
    court_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    court_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    court_city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    court_state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    court_zip: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Record Details

    record_details: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        record_type: "Person",
        first_name: "",
        last_name: "",
        aka: "",
        ssn: "",
        continuous_trauma: false,
        date_of_injury: "",
        record_address: "",
        record_city: "",
        record_state: "",
        record_zip: "",
      },
    },

    // record_type: {
    //   type: DataTypes.ENUM("Person", "Entity"),
    //   allowNull: false,
    // },
    // first_name: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // last_name: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // aka: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // ssn: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // date_of_injury: {
    //   type: DataTypes.DATE,
    //   allowNull: true,
    // },
    // record_address: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // record_city: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // record_state: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // record_zip: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },



    // Relationships
    bill_to: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: "orders",
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ["file_number"],
      },
      {
        fields: ["created_by"],
      },
    ],
  }
);




module.exports = Order;
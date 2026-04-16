// Req Seq
const { sequelize } = require("../config/dbConfig");

// DataTypes
const { DataTypes } = require("sequelize");

// Create Model
const Payment = sequelize.define(
    "Payment",
    {
        id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        },

        paymentGetawayId: {
        type: DataTypes.STRING,
        },

        amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        },

        currency: {
        type: DataTypes.STRING,
        defaultValue: "usd",
        },

        status: {
        type: DataTypes.ENUM("pending", "succeeded", "failed"),
        defaultValue: "pending",
        },
    },
    { timestamps: true },
);

// Export
module.exports = { Payment };
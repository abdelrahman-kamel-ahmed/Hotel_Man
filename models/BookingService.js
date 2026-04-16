// Req Seq
const { sequelize } = require("../config/dbConfig");

// DataTypes
const { DataTypes } = require("sequelize");

// Create Model
const BookingService = sequelize.define(
    "BookingService",
    {
        id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        },

        quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        },
    },
    { timestamps: true }
);

// Export
module.exports = { BookingService };
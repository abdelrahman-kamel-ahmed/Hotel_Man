// Req Seq
const { sequelize } = require("../config/dbConfig");

// DataTypes
const { DataTypes } = require("sequelize");

// Create Model
const Service = sequelize.define(
    "Service",
    {
        id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        },

        name: { type: DataTypes.STRING, allowNull: false },

        description: { type: DataTypes.STRING, allowNull: false },

        price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        },
    },
    { timestamps: true },
);

// Export
module.exports = { Service };
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

// Create Model
const RoomType = sequelize.define(
    "RoomType",
    {
        id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        },

        name: {
        type: DataTypes.STRING,
        allowNull: false,
        },

        price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        },

        capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        },
    },
    { timestamps: true },
);

module.exports = {
    RoomType
};
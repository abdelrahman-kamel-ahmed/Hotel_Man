//  import sequelize instance from dbConfig
const {sequelize}= require('../config/dbConfig');
//import data Tyepes from sequelize
const {DataTypes} = require('sequelize');

//create a room model
const Room = sequelize.define('Room',{
    id : {
        type : DataTypes.UUID,
        primaryKey : true,
        defaultValue : DataTypes.UUIDV4
    },
    roomNumber : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true,
    },
    floor: {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    status : {
        type : DataTypes.ENUM('available','occupied','maintenance'),
        defaultValue : 'available'
    },
});
module.exports = {
    Room
};

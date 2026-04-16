//  import sequelize instance from dbConfig
const {sequelize}= require('../config/dbConfig');
//import data Tyepes from sequelize
const {DataTypes} = require('sequelize');
//create a booking model
const Booking = sequelize.define('Booking',{
    id : {
        type : DataTypes.UUID,
        primaryKey : true,        
        defaultValue : DataTypes.UUIDV4
    },
    checkInDate : {
        type : DataTypes.DATE,
        allowNull : false,
    },
    checkOutDate : {
        type : DataTypes.DATE,
        allowNull : false,
    },
    totalPrice : {
        type : DataTypes.FLOAT,
        allowNull : false,
    },
    status : {
        type : DataTypes.ENUM('pending','confirmed','cancelled','checked-in','checked-out'),
        defaultValue : 'pending'
    },
},{
    timestamps : true
});
module.exports = {Booking}
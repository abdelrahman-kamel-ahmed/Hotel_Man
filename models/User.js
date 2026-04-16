//req sequelize instance from dbConfig
const {sequelize} = require('../config/dbConfig');  
//import data Tyepes from sequelize
const {DataTypes} = require('sequelize');
//import bcrypt for password hashing
const bcrypt = require('bcrypt');
//import jwt for token generation
const jwt = require('jsonwebtoken');
//import dotenv
require('dotenv').config();

//function define creates a model it takes 
//1.name of the model
//2.SCHEMA of the model
//3.options for the model
const User = sequelize.define('User',{

    id : {
        type : DataTypes.UUID,
        primaryKey : true,
        defaultValue : DataTypes.UUIDV4
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false,
        validators : {
            notEmpty : true,
            len : [2,50]
        }    
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true,
        validators : {
            notEmpty : true,
            isEmail : true
        }
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    role: {
        type : DataTypes.ENUM('admin','receptionist'),
        defaultValue : 'receptionist'
    }
},{
    timestamps : true
    ,hooks : {
        beforeCreate : async (user) => {
            //hash password before saving to database
            user.password = await bcrypt.hash(user.password,10);        
        },
        beforeUpdate : async (user) => {
            //hash password before saving to database if password is changed
            if(user.changed('password')){
                user.password = await bcrypt.hash(user.password,10);
            }
        }
    }
});

//method to generate JWT token
//use the prototype property of the User model to add a method called generateToken.
//bec if u write User.generateToken it will be a static method and we want to generate token for each user instance so we use prototype.
//but a static method is a method that is called on the class itself rather than on an instance of the class.
User.prototype.generateToken = function(){
    const token = jwt.sign({id : this.id,role : this.role},process.env.JWT_SECRET,{expiresIn : process.env.JWT_EXPIRES_IN});
    return token;
}
module.exports = {
    User
};
    
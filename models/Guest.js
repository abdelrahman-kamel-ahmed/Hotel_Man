const {sequelize} = require('../config/dbConfig');
//import data Tyepes from sequelize
const {DataTypes} = require('sequelize');
//create a guest model
const Guest = sequelize.define('Guest',{
    id : {
        type : DataTypes.UUID,
        primaryKey : true,
        defaultValue : DataTypes.UUIDV4
    },
    Firstname : {
        type : DataTypes.STRING,
        allowNull : false,
        validators : {
            notEmpty : true,
            len : [2,50]
        }    
    },
    Lastname : {
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
            isEmail : true
        }
    },
    nationalId : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true,
    },
    phone : {
        type : DataTypes.STRING,
        allowNull : false,
    }
},{
    timestamps : true,
    indexes: [  {fields : ['email']},
                {fields : ['phone']},
                {fields : ['nationalId'], unique : true},
    ]
});
module.exports = {
    Guest
}
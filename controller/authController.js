// authController.js
// req models
const { User } = require("../models");
// req validators
const { registerSchema, loginSchema } = require("../validators/authValidator");
// req bcrypt for password hashing
const bcrypt = require("bcrypt");
// req jwt for token generation
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        //1. validate user input
        const{error,value} = registerSchema.validate(req.body,{abortEarly : false});
        //2. handle validation error
        if(error){
            const errors = error.details.map(err => err.message);
            return res.status(400).json({message: "Validation Error", errors});
        }
        //3. check if user already exists
        const user = await User.findOne({where : {email : value.email}});
        if(user){
            return res.status(409).json({message : "User already exists"});
        }
        //4. create user
        const newUser = await User.create(value);
        //5. return response without password
        res.status(201).json({message : "User registered successfully",user : newUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
exports.login = async (req, res) => {
    try {
        //1. validate user input
        const{error,value} = loginSchema.validate(req.body,{abortEarly : false});
        //2. handle validation error
        if(error){
            const errors = error.details.map(err => err.message);
            return res.status(400).json({message: "Validation Error", errors});
        }
        //3. check if user exists
        const user = await User.findOne({where : {email : value.email}});
        if(!user){
            return res.status(400).json({message : "Invalid email or password"});
        }
        //4. compare password        
        const isMatch = await bcrypt.compare(value.password,user.password);
        if(!isMatch){
            return res.status(400).json({message : "Invalid email or password"});
        }
        //5. generate token
        const token = user.generateToken();
        res.status(200).json({message : "Login successful",token});
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
exports.getMe = async (req, res) => {
    try {
        const UserId= req.user.id;
        const user = await User.findByPk(UserId ,{attributes : {exclude : ["password"]}});
        if(!user){
            return res.status(404).json({message : "User not found"});
        }
        res.status(200).json({message : "User details",user});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const Admin = require('../models/Admin');
const Profile = require('../models/adminData');
const {StatusCodes} = require('http-status-codes');
const { BadRequestError, UnauthenticatedError} = require('../errors');

const register = async (req,res)=>{
    try {
                const admin = await Admin.create({...req.body});
                //creating a admin profile upon account creation
                const profile = await Profile.create({createdBy: admin._id,admin: admin.name});
                res.status(StatusCodes.CREATED).json({msg: "Admin Account Created"});
      
    } catch (error) {
         res.status(StatusCodes.OK).json({msg: "Email is already registered"});
         //res.status(StatusCodes.OK).json(error.message);
    }
}

const login = async (req, res)=>{
    try{
        const {email, password} = req.body;
        //Check if email exist
        const admin = await Admin.findOne({email});
        if(admin){
            //Check if password is correct
            const isPasswordCorrect = await admin.comparePassword(password);
            if(!isPasswordCorrect){
                res.status(StatusCodes.OK).json({msg: "Invalid Credentials"});
            }
            else{
                const token = admin.createJWT()
                res.status(StatusCodes.OK).json({ name: admin.name ,role: "admin", token });
            }
        }
        else{
            res.status(StatusCodes.OK).json({msg: "Invalid Credentials"});
        }
}
catch(error){
    res.status(StatusCodes.BAD_REQUEST).json({msg: error.message});
}
}

module.exports = {
    register,
    login
}
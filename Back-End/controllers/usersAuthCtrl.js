const User = require('../models/User');
//const Profile = require('../models/usersData');
const {StatusCodes} = require('http-status-codes');
const { BadRequestError, UnauthenticatedError} = require('../errors');
const sendEmail = require('./../email');
const crypto = require('crypto');

// const register = async (req,res)=>{
//     try {
//         const user = await User.create({...req.body});
//         //creating a user profile upon account creation
//         const profile = await Profile.create({createdBy: user._id,user: user.name});
//         res.status(StatusCodes.CREATED).json({msg: "User created"});
//     } catch (error) {
//         res.status(StatusCodes.OK).json({msg: "Email is already registered"});
//     }
// }

const login = async (req, res)=>{
    try{
        const {email, password} = req.body;
        //Check if email exist
        const user = await User.findOne({email});
        if(user){
            //Check if password is correct
            const isPasswordCorrect = await user.comparePassword(password);
            if(!isPasswordCorrect){
                res.status(StatusCodes.OK).json({msg: "Invalid Credentials"});
            }
            else{
                const token = user.createJWT()
                res.status(StatusCodes.OK).json({ name: user.name , token });
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

const forgotPassword = async(req, res)=>{
        // get user based on posted email
    const {email} = req.body;
    //Check if email exist
    const user = await User.findOne({email});
    
    if(!user){
        res.status(StatusCodes.NOT_FOUND).json({msg: "Email does not exist"});
    }
    else{
        //generate random reset token
      const resetToken = await user.createResetPasswordToken();
      await user.save();

      //send token to user email
      //const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;

      const message = `Password reset request received. Please copy and paste the token below in the token field to reset your password\n\nToken: ${resetToken}\n\nThis token is only valid for 10 minutes\n\nPlease do not share your token`;

       try {
        await sendEmail({
            email: user.email,
            subject: 'Reset Password',
            message: message
          })
          res.status(StatusCodes.OK).json({msg: 'A token has been sent to your email address'});
       } catch (error) {
           user.passwordResetToken = undefined;
           user.passwordResetTokenExpires = undefined;
           res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: 'An error has occurred, please try again later'});
       }
    }
}

const resetPassword = async(req, res)=>{
    //encrypting the token to match with that stored in the database
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
    //checking if token exists
   const user = await User.findOne({passwordResetToken: token, passwordResetTokenExpires: {$gt:Date.now()}});

   if(!user){
    res.status(StatusCodes.BAD_REQUEST).json({msg: 'Token is invalid or has expired'});
   }
   else{
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    //saving password
    user.save();
    res.status(StatusCodes.OK).json({msg: "Password reset successful"});
   }
}

module.exports = {
    //register,
    login,
    forgotPassword,
    resetPassword
}
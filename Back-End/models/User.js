const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: 50,
        minlength: 3,
      },
      email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Please provide a valid email',
        ],
        unique: true,
      },
      password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
      },
      passwordResetToken: String,
      passwordResetTokenExpires: Date
},
{ timestamps: true }
);

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function(){
    return jwt.sign(
     { userID: this._id, name: this.name },process.env.JWT_SECRET,{expiresIn: '24h'}
    );
}

UserSchema.methods.comparePassword = async function(candidatePassword){
   const isMatch = await bcrypt.compare(candidatePassword, this.password);
   return isMatch;
}

UserSchema.methods.createResetPasswordToken = async function(){
   const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');//encrypted
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
}

module.exports = mongoose.model('User', UserSchema);
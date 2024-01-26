const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
      user:{
          type: String
      },
      profilePictureURL: {
         type: String,
         default: "https://youtrack-hfl0.onrender.com/api/v1/userprofilepictures/default.png"
      },
      userCategory: {
          type: [],
          default: ['Food','Drinks','Shopping', 'Housing', 'Transportation', 'Vehicle','Lifestyle','Gadgets','Financial Expenses', 'Investments','Income','Others']
      },
      currencyType: {
          type: String,
          default: 'GHS'
      },
      filterBy:{
          type: String,
          default: "year"
      },
      role: {
        type: String
      },
      permissions: {
        type: []
      },
      owner:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
      }
},
{timestamps: true}
);

module.exports = mongoose.model('UserProfileData', ProfileSchema);
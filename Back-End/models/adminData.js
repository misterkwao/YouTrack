const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
      admin:{
          type: String
      },
      profilePictureURL: {
         type: String,
         default: "https://youtrack-hfl0.onrender.com/api/v1/adminprofilepictures/default.png"
      },
      adminCategory: {
          type: [],
          default: ['Food & Drinks','Shopping', 'Housing', 'Transportation', 'Vehicle','Lifestyle','Gadgets','Financial Expenses', 'Investments','Income','Others']
      },
      currencyType: {
          type: String,
          default: 'GHS'
      },
      filterBy:{
          type: String,
          default: "year"
      },
      createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide admin'],
    }
},
{timestamps: true}
);

module.exports = mongoose.model('AdminProfileData', ProfileSchema);
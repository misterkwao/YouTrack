const mongoose = require('mongoose');
const IncExpSchema = new mongoose.Schema({
   recordType: {
      type: String,
      required: [true, 'Please choose a record type'],
      enum: ['income', 'expense']
   },
  amount: {
      type: Number,
      required: [true, 'Please enter an amount'],
   },
   pv: {
     type: String,
     required: [true, 'Please enter your payment voucher number'],
   },
   attachmentUrl: {
      type: String
     },
  category: {
      type: String,
      required: [true, 'Please choose a category'],
   },
  description:{
      type: String,
      required: [true, 'Please enter a description'],
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        required: [true, 'Please choose a user'],
    },
    creatorName: {
      type: String
    },
    lastEditedBy: {
      type: String,
      default: "Not edited"
    }
},
 {timestamps: true}
 );

module.exports = mongoose.model('IncExpData', IncExpSchema);
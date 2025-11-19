const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ForgotpasswordSchema = new Schema({
    id: {
        type: String,
        require: true
      },
    active: {
        type: Boolean,
        default: true
    },
    expiresby: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }    
})

module.exports = mongoose.model('forgotpassword',ForgotpasswordSchema);
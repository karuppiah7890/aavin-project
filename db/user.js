const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  displayName: {
    type: String,
    required: [true, 'Name is required']
  },
  mobile: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v)
      },
      message: '{VALUE} is not a valid mobile number!'
    },
    required: [true, 'User mobile number is required']
  },
  role: {
    type: String,
    enum: ['admin', 'support_staff', 'parlor_staff'],
    required: [true, 'Role is required']
  },
  roleDetails: mongoose.Schema.Types.Mixed,
})

const User = mongoose.model('User', userSchema)

module.exports = User

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
  role: {
    type: String,
    enum: ['admin', 'support_staff', 'parlor_staff'],
    required: [true, 'Role is required']
  },
  roleDetails: mongoose.Schema.Types.Mixed,
})

const User = mongoose.model('User', userSchema)

module.exports = User

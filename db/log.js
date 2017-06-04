const mongoose = require('mongoose')

const logSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required']
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
  logDetail: {
    type: String,
    enum: ['in', 'out'],
    required: [true, 'Log detail is required']
  },
  time: {
    type: Date,
    default: Date.now
  },
})

const Log = mongoose.model('Log', logSchema)

module.exports = Log

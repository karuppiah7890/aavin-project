const mongoose = require('mongoose')

const parlorSchema = mongoose.Schema({
  parlorName: {
    type: String,
    required: [true, 'Parlor name is required']
  },
})

const Parlor = mongoose.model('Parlor', parlorSchema)

module.exports = Parlor

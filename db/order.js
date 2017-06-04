const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required']
  },
  customerNumber: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v)
      },
      message: '{VALUE} is not a valid mobile number!'
    },
    required: [true, 'Customer mobile number is required']
  },
  customerAddress: {
    type: String,
    required: [true, 'Customer address is required']
  },
  orderDetails: {
    type: String,
    required: [true, 'Order details are required']
  },
  orderStatus: {
    type: String,
    enum: ['taken', 'confirmed', 'delivered'],
    required: [true, 'Order status is required']
  },
  parlorId: {
    type: mongoose.Schema.Types.ObjectId
  },
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order

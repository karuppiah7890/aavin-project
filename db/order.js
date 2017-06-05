const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  createdBy: {
    type: String,
    required: [true, 'Username of the User who created the order is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required']
  },
  customerAddress: {
    type: String,
    required: [true, 'Customer address is required']
  },
  customerMobile: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v)
      },
      message: '{VALUE} is not a valid mobile number!'
    },
    required: [true, 'Customer mobile number is required']
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
  statusUpdatedAt: {
    type: Date,
    default: Date.now
  },
  parlorId: {
    type: mongoose.Schema.Types.ObjectId
  },
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order

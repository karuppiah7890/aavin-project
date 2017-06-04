module.exports = function(config) {

  const mongoose = require('mongoose')

  mongoose.Promise = global.Promise
  mongoose.connect(config.mongoUrl)

  const connection = mongoose.connection

  connection.on('error', function(err) {
    console.error(err)
  })

  // When successfully connected
  connection.once('open', function() {
    console.log('Connected to MongoDB!')
  })

  // If the connection throws an error
  connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err)
  })

  // When the connection is disconnected
  connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected')
  })

  require(`${__dirname}/parlor`)
  require(`${__dirname}/user`)
  require(`${__dirname}/order`)
  require(`${__dirname}/log`)


}

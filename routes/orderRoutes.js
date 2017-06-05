const ensureLogin = require('connect-ensure-login'),
  mongoose = require('mongoose'),
  Order = mongoose.model('Order'),
  Parlor = mongoose.model('Parlor'),
  errorJSON = require('../error/errorJSON'),
  Constants = require('../Constants')

module.exports = {
  routes: function(app) {

    // GET - HTML response.
    // POST - JSON response
    app.route('/createOrder')
    .get(ensureLogin.ensureLoggedIn('/login'), (req, res) => {
      if(req.user.role === 'support_staff')
        res.render('createOrder.html')
      else
        res.status(403).send('You are not allowed to access this page. Only Support Staff can access this page.');
    })
    .post((req, res) => {
      if(req.user && req.user.role === 'support_staff') {
        //console.log(req.body)
        const {
          customerName,
          customerAddress,
          customerMobile,
          orderDetails,
          parlorId
        } = req.body

        if(!parlorId) {
          res.json(errorJSON.errorOccurred('Fill in the parlor name'))
          return
        }

        const newOrder = {
          createdBy: req.user.username,
          customerName: customerName,
          customerAddress: customerAddress,
          customerMobile: customerMobile,
          orderDetails: orderDetails,
          orderStatus: 'taken',
          parlorId: parlorId
        }

        //console.log(new mongoose.Types.ObjectId(parlorId))

        Parlor.findOne({
          _id: new mongoose.Types.ObjectId(parlorId)
        })
        .then((result) => {
          if(!result) {
            throw new Error(Constants.PARLOR_DOESNT_EXIST)
          } else {
            return Order.create(newOrder)
          }
        })
        .then((result) => {
          if(result) {
            res.json({
              status: 'success',
              message: Constants.ORDER_CREATED
            })
          } else {
            throw new Error('Some error occurred')
          }
        })
        .catch((err) => {
          console.log(err)
          res.json(errorJSON.errorOccurred(err.message))
        })
      } else {
        res.json(errorJSON.accessDenied('Support Staff'))
        return
      }
    })

  }
}

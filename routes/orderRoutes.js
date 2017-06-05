const ensureLogin = require('connect-ensure-login'),
  mongoose = require('mongoose'),
  Order = mongoose.model('Order'),
  Parlor = mongoose.model('Parlor'),
  errorJSON = require('../error/errorJSON'),
  Constants = require('../Constants')

module.exports = {
  routes: function(app) {

    //POST - JSON response
    app.post('/getOrderStatus', (req, res) => {
      if(!req.user) {
        res.json(errorJSON.accessDenied('Admin/Support Staff/Parlor Staff'))
        return
      }

      const {
        orderId
      } = req.body;

      if(!orderId) {
        res.json(errorJSON.errorOccurred('Invalid Order ID'))
        return
      }

      Order.findOne({
        _id: new mongoose.Types.ObjectId(orderId)
      })
      .then((result) => {
        res.json({
          status: 'success',
          data: {
            _id: result._id,
            orderStatus: result.orderStatus,
            statusUpdatedAt: result.statusUpdatedAt
          }
        })
      })
      .catch((err) => {
        console.log(err)
        res.json(errorJSON.errorOccurred(err.message))
      })

    })

    //POST - JSON response
    app.post('/setOrderStatus', (req, res) => {

      if(req.user && req.user.role === 'parlor_staff') {

      } else {
        res.json(errorJSON.accessDenied('Parlor Staff'))
        return
      }

    })

    // POST - JSON response
    app.post('/getOrders', (req, res) => {

      console.log(req.body)

      if(!req.user) {
        res.json(errorJSON.accessDenied('Admin/Support Staff/Parlor Staff'))
        return
      }

      const {
        beforeTimestamp,
        afterTimestamp
      } = req.body;

      let beforeTs, afterTs, limit

      if(afterTimestamp && beforeTimestamp) {
        // for getting orders in between two timestamps - can be used for analysis
        afterTs = afterTimestamp
        beforeTs = beforeTimestamp
      } else if(afterTimestamp){
        // for getting latest orders after a timestamp
        afterTs = afterTimestamp
        beforeTs = new Date()
      } else if(beforeTimestamp){
        // for getting older orders before a timestamp
        afterTs = new Date("1970-01-01")
        beforeTs = beforeTimestamp
        limit = 10
      } else {
        // for getting latest orders
        afterTs = new Date("1970-01-01")
        beforeTs = new Date()
        limit = 10
      }

      console.log('beforeTs: ', beforeTs, '. afterTs: ', afterTs);

      const role = req.user.role;
      let query;

      if(role === 'admin')
        query = Order.where('createdAt').gt(afterTs).lt(beforeTs).sort({ createdAt: 'desc' })

      else if(role === 'support_staff')
        query = Order.find({createdBy: req.user.username}).where('createdAt').gt(afterTs).lt(beforeTs)
                     .sort({ createdAt: 'desc' })

      else
        query = Order.find({parlorId: req.user.roleDetails.parlorId}).where('createdAt')
                     .gt(afterTs).lt(beforeTs).sort({ createdAt: 'desc' })


      query.limit(limit).exec()
      .then((result) => {
        if(!result) {
          res.json({
            status: 'success',
            data: []
          })
        } else {
          //console.log(result)
          res.json({
            status: 'success',
            data: result
          })
        }
      })
      .catch((err) => {
        res.json({
          status: 'error',
          error: err
        })
      })
    })

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
              message: Constants.ORDER_CREATED,
              data: result
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

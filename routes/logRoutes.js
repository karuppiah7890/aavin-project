const ensureLogin = require('connect-ensure-login'),
  mongoose = require('mongoose'),
  Log = mongoose.model('Log'),
  errorJSON = require('../error/errorJSON'),
  Constants = require('../Constants')

module.exports = {
  routes: function(app) {
    // GET - HTML Response
    app.get('/allLogs', ensureLogin.ensureLoggedIn('/login'), (req, res) => {
      if(req.user.role === 'admin') {
        res.render('allLogs.html')
      } else {
        res.status(403).send('You are not allowed to access this page. Only Admin can access this page.');
        return
      }
    })

    // POST - JSON Response
    app.post('/getLogs', (req, res) => {
      if(req.user && req.user.role === 'admin') {
        console.log(req.body)

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

        console.log(' afterTs: ', afterTs, '. beforeTs: ', beforeTs);

        const query = Log.where('time').gt(afterTs).lt(beforeTs).sort({ time: 'desc' })

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
      } else {
        res.json(errorJSON.accessDenied('Admin'))
        return
      }
    })
  }
}

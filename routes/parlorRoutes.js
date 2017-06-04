const ensureLogin = require('connect-ensure-login'),
  mongoose = require('mongoose'),
  Parlor = mongoose.model('Parlor'),
  errorJSON = require('../error/errorJSON')
  Constants = require('../Constants')
  
module.exports = {
  routes: function(app) {

    // GET - JSON response
    app.get('/getParlors', (req, res) => {

      if(!req.user) {
        res.json(errorJSON.accessDenied('Admin'))
        return
      }

      Parlor.find()
      .exec()
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
    app.route('/createParlor')
    .get(ensureLogin.ensureLoggedIn('/login'), (req, res) => {
      if(req.user.role === 'admin') {
        res.render('createParlor.html')
      } else {
        res.status(403).send('You are not allowed to access this page. Only Admin can access this page.');
      }
    })
    .post((req, res) => {
      if(req.user && req.user.role === 'admin') {
        console.log(req.body);
        const {parlorName} = req.body;

        Parlor.findOne({parlorName: parlorName})
        .then((result) => {
          if(result) {
            res.json({
              status: 'success',
              message: Constants.PARLOR_EXISTS
            })
          } else {
            Parlor.create({
              parlorName: parlorName
            })
            .then((result) => {
              if(result) {
                res.json({
                  status: 'success',
                  message: Constants.PARLOR_CREATED
                })
              } else {
                res.json(errorJSON.errorOccurred('Some error occurred'))
              }
            })
            .catch((err) => {
              res.json(errorJSON.errorOccurred(err))
            })
          }
        })
        .catch((err) => {
          res.json(errorJSON.errorOccurred(err))
        })

      } else {
        res.json(errorJSON.accessDenied('Admin'))
        return
      }
    })


  }
}

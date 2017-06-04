const ensureLogin = require('connect-ensure-login'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Parlor = mongoose.model('Parlor'),
  errorJSON = require('../error/errorJSON'),
  Constants = require('../Constants')

module.exports = {
  routes: function(app) {

    // GET - HTML response
    // POST - JSON response
    app.route('/createUser')
    .get(ensureLogin.ensureLoggedIn('/login'), (req, res) => {
      if(req.user.role === 'admin') {
        res.render('createUser.html')
      } else {
        res.status(403).send('You are not allowed to access this page. Only Admin can access this page.');
      }
    })
    .post((req, res) => {
      if(req.user && req.user.role === 'admin') {
        console.log(req.body);
        const {
          username,
          password,
          displayName,
          role,
          parlorId
        } = req.body;

        console.log(new mongoose.Types.ObjectId(parlorId))

        Parlor.findOne({
          _id: new mongoose.Types.ObjectId(parlorId)
        })
        .then((result) => {
          if(!result) {
            throw new Error(Constants.PARLOR_DOESNT_EXIST)
          } else {
            return User.findOne({
              username: username
            })
          }
        })
        .then((result) => {
          if(result) {
            throw new Error(Constants.USER_ALREADY_EXISTS)
          } else {
            return User.create({
              username: username,
              password: password,
              displayName: displayName,
              role: role,
              roleDetails: {
                parlorId: parlorId
              }
            })
          }
        })
        .then((result) => {
          if(result) {
            res.json({
              status: 'success',
              message: Constants.USER_CREATED
            })
          } else {
            throw new Error('Some error occurred')
          }
        })
        .catch((err) => {
          console.log(err);
          res.json(errorJSON.errorOccurred(err.message))
        })

      } else {
        res.json(errorJSON.accessDenied('Admin'))
        return
      }
    })

  }
}

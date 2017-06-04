module.exports = function(config) {

  const mongoose = require('mongoose'),
  Log = mongoose.model('Log'),
  passport = require('passport'),
  local = require('./local')(passport),
  sessions = require('./sessions')

  sessions(passport)

  return {
    init: function(app) {
      app.use(passport.initialize())
      app.use(passport.session())

      local.routes(app);

      // GET - HTML response (redirect)
      app.get('/logout', function(req, res){
        const {
          username,
          displayName,
          role
        } = req.user

        Log.create({
          username: username,
          displayName: displayName,
          role: role,
          logDetail: 'out'
        }).then((logCreatedResult) => {
          if(!logCreatedResult) {
            console.log('Some error occurred while logging into Logs collection')
          }
          req.logout()
          req.flash('message', 'Successfully logged out!')
          res.redirect('/login')
        }).catch((err) => {
          console.log('Error occurred while logging into Logs collection. Error: ', err)
          req.logout()
          req.flash('message', 'Successfully logged out!')
          res.redirect('/login')
        })
      });

    }
  }
}

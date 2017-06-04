module.exports = function(config) {

  const mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  local = require('./local')(passport),
  sessions = require('./sessions')
  
  sessions(passport)

  return {
    init: function(app) {
      app.use(passport.initialize())
      app.use(passport.session())

      app.get('/login', (req,res) => {
        res.render('login.html', { message: req.flash('message') })
      });

      local.routes(app);

      app.get('/logout', function(req, res){
        req.logout()
        req.flash('message', 'Successfully logged out!')
        res.redirect('/login')
      });

    }
  }
}

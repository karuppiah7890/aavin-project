module.exports = function(passport) {

  const LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    User = mongoose.model('User')

  passport.use(new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
      User.findOne({username: username, password: password})
      .then((result) => {
          if(result) {
            //console.log("found local user in db", result)
            done(null, result)
          } else {
            req.flash('message','Invalid username or password')
            done(null, false)
          }
      })
      .catch((err) => {
        done(err)
      })
    }
  ))

  return {
    routes: function(app) {

      app.post('/login',
                passport.authenticate('local', { successReturnToOrRedirect: '/',
                                                 failureRedirect: '/login'}))

    }
  }

}

module.exports = function(passport) {

  const LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Log = mongoose.model('Log')

  passport.use(new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
      User.findOne({username: username, password: password})
      .then((result) => {
          if(result) {
            //console.log("found local user in db", result)
            const {
              username,
              displayName,
              role
            } = result

            Log.create({
              username: username,
              displayName: displayName,
              role: role,
              logDetail: 'in'
            }).then((logCreatedResult) => {
              if(!logCreatedResult) {
                console.log('Some error occurred while logging into Logs collection')
              }
              done(null, result)
            }).catch((err) => {
              console.log('Error occurred while logging into Logs collection. Error: ', err)
              done(null, result)
            })

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

      // GET - HTML response
      // POST - HTML response (redirect)
      app.route('/login')
      .get((req,res) => {
        res.render('login.html', { message: req.flash('message') })
      })
      .post(passport.authenticate('local', { successReturnToOrRedirect: '/',
                                             failureRedirect: '/login'}))

    }
  }

}

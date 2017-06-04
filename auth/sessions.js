module.exports = function(passport) {
  const mongoose = require('mongoose'),
    User = mongoose.model('User')

  passport.serializeUser(function(profile, done) {
    //console.log(`Store the user's username: ${profile.username} in session data store`);
    const sessionData = {
      username: profile.username
    };
    done(null, sessionData);
  });

  passport.deserializeUser(function(sessionData, done) {
    //console.log("got session id. found session data : ", sessionData);
    // find user using username stored in session data store and fill in user details in done
    User.findOne({username: sessionData.username})
    .then((result) => {
        //console.log("got user data through session data : ", result);
        if(result) {
          done(null, result);
        } else {
          done(null, null);
        }
    })
    .catch((err) => {
      console.log(err);
      done(err);
    });
  });
}

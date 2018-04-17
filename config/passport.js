const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (error, user) => {
    if (error) return done(error);
    if (!user) return done(null, false);
    done(null, user);
  });
});

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({username}, (error, user) => {
      if (error) return done(error);
      if (!user) return done(null, false);
      if (!user.verifyPassword(password)) return done(null, false);
      return done(null, user);
    });
  }),
);

module.exports = passport;

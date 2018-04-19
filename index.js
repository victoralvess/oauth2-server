const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login');
const uid = require('uid2');

const oauth2 = require('./oauth2'); // Server
const passportConfig = require('./config/passport');

const {Client, User} = require('./models');

mongoose.connect('mongodb://localhost:27017/aaa');

const app = express();

app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['secret'],
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Index Page',
    user: req.user,
  });
});

app.get('/register', ensureLoggedOut('/admin'), (req, res) => {
  res.render('register', {user: req.user});
});

app.post('/register', ensureLoggedOut('/admin'), (req, res) => {
  new User({
    username: req.body.username,
    password: req.body.password,
  })
    .save()
    .then(() => {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/admin');
      });
    })
    .catch(error => {
      console.log(error);
      res.render('register', {
        user: req.user,
        error,
      });
    });
});

app.get('/login', ensureLoggedOut('/admin'), (req, res) => {
  res.render('login', {user: req.user});
});

app.post(
  '/login',
  ensureLoggedOut('/admin'),
  passport.authenticate('local'),
  (req, res) => {
    res.redirect('/');
  },
);

app.get('/logout', ensureLoggedIn('/login'), (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/admin', ensureLoggedIn('/login'), (req, res) => {
  Client.findOne({user_id: req.user.id}).then(client => {
    if (client) {
      res.render('admin', {
        client_id: client.client_id,
        client_secret: client.client_secret,
        user: req.user,
      });
    } else {
      res.render('admin', {user: req.user});
    }
  });
});

app.post('/credentials', ensureLoggedIn('/login'), (req, res) => {
  Client.findOne({user_id: req.user.id}).then(client => {
    if (client) {
      client.remove();
    }

    new Client({
      client_id: uid(32),
      client_secret: uid(16),
      user_id: req.user.id,
    })
      .save()
      .then(() => res.redirect('admin'));
  });
});

app.post('/oauth2/token', oauth2.token);

app.get('/hello', (req, res) => {
  res.send("It's working!\n");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server running at: http://localhost:${process.env.PORT || 3000}/`,
  );
});

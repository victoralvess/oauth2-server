const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const {ensureLoggedIn} = require('connect-ensure-login');

const oauth2 = require('./oauth2'); // Server
const passportConfig = require('./config/passport');

const Client = require('./models/client');

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
  });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  res.send('Not implemented');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/admin', ensureLoggedIn('/login'), (req, res) => {
  Client.findOne({user_id: req.user.id}).then(client => {
    if (client) {
      res.render('admin', {
        client_id: client.client_id,
        client_secret: client.client_secret,
      });
    } else {
      res.render('admin');
    }
  });
});

app.post('/credentials', ensureLoggedIn('/login'), (req, res) => {
  Client.findOne({user_id: req.user.id}).then(client => {
    if (!client) {
      new Client({
        client_id: 'client',
        client_secret: 'secret',
        user_id: req.user.id,
      })
        .save()
        .then(client => {
          /*res.render('admin', {
          client_id: client.client_id,
          client_secret: client.client_secret,
        })*/
          res.redirect('admin');
        });
    } else {
      res.redirect('admin');
    }
  });
});

app.get('/oauth2/token', oauth2.token);

app.get('/hello', (req, res) => {
  res.send("It's working!\n");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server running at: http://localhost:${process.env.PORT || 3000}/`,
  );
});

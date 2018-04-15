const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const oauth2 = require('./oauth2');

mongoose.connect('mongodb://localhost:27017/aaa');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

app.get('/oauth2/token', oauth2.token);

app.get('/hello', (req, res) => {
	res.send("It's working!\n");
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server running at: http://localhost:${process.env.PORT || 3000}/`);
});
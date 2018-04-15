const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const { Strategy: ClientPasswordStrategy } = require('passport-oauth2-client-password');

const Client = require('../models/client');

const validateClient = (client_id, client_secret, done) => {
	Client
		.findOne({ client_id })
		.then(client => {
			if (!client) return done(null, false);
			if (client.client_secret !== client_secret) return done(null, false);

			done(null, client);
		})
		.catch(error => done(error));
}

passport.use(new BasicStrategy(validateClient));
passport.use(new ClientPasswordStrategy(validateClient));

module.exports = passport;
const passport = require('passport');
const server = require('./server');
const Strategies = require('./strategies');

module.exports.token = [
	passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
	server.token(),
	server.errorHandler()
];
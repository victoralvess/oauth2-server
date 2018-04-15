const oauth2orize = require('oauth2orize');
const uid = require('uid2');
const _ = require('lodash');

const Client = require('../models/client');
const AccessToken = require('../models/access-token');

const server = oauth2orize.createServer();

server.serializeClient((client, done) => {
	done(null, client.id);
});

server.deserializeClient((id, done) => {
	Client
		.findById(id)
		.then(client => done(null, client))
		.catch(error => done(error));
});

server.exchange(oauth2orize.exchange.clientCredentials((client, scope, done) => {
	Client
		.findOne({ client_id: client.client_id })
		.then(localClient => {
			if (!localClient) return done(null, false);
			if (localClient.client_secret !== client.client_secret) return done(null, false);
			if (!validateScope(scope, localClient.scope)) return done(null, false);

			new AccessToken({
				access_token: uid(256),
				client_id: client.client_id,
				expires_in: 3600,
				scope: scope
			})
				.save()
				.then(accessToken => done(null, accessToken.access_token))
				.catch(error => done(error));
		})
		.catch(error => {
			done(error);
		});
}));

const validateScope = (requestedScope, allowedScope) => {
	const diff = _.difference(requestedScope, allowedScope);

	return (diff.length === 0);
}

module.exports = server;
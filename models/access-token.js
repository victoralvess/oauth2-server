const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('access_token', new Schema({
	access_token: String,
	client_id: String,
	expires_in: Number,
	scope: [String]
}));
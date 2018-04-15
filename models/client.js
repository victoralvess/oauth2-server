const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('client', new Schema({
	app_name: String,
	client_id: String,
	client_secret: String,
	scope: [String]
}));
const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  username: String,
  password: String
});

schema.method({
  verifyPassword: async (password) => {
    return (this.password === password);
  }
});

module.exports = mongoose.model('user', schema);

const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});

schema.loadClass(class {
  verifyPassword(password) {
    return (this.password === password);
  }
});

module.exports = mongoose.model('user', schema);

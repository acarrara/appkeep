const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  oauthId: Number
});

const model = mongoose.model('Users', userSchema);

module.exports = model;

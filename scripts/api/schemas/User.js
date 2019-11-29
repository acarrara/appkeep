const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  date: {type: Date},
});

const model = mongoose.model('Users', userSchema);

module.exports = model;

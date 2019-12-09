const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  date: {type: Date},
  hue: {type: Number},
  name: String
});

const model = mongoose.model('Users', userSchema);

module.exports = model;

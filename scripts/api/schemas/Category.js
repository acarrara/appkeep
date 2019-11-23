const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category: {type: String, trim: true},
  hue: Number
});

const model = mongoose.model('Categories', categorySchema);

module.exports = model;

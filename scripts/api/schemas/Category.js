const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category: {type: String, trim: true},
  date: {type: Date},
  hue: {type: Number},
  income: {type: Boolean}
});

const model = mongoose.model('Categories', categorySchema);

module.exports = model;

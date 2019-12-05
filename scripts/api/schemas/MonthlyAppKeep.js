const mongoose = require('mongoose');

const appKeepSchema = new mongoose.Schema({
  title: {type: String, trim: true},
  category: {type: String, trim: true},
  date: {type: Date},
  amount: {type: Number, min: 0},
  user: {type: String},
  income: {type: Boolean}
});

const model = mongoose.model('MonthlyAppKeeps', appKeepSchema);

module.exports = model;

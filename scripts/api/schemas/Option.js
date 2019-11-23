const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  title: {type: String, trim: true},
  category: {type: String, trim: true}
});

const model = mongoose.model('Options', optionSchema);

module.exports = model;

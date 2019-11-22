const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  endpoint: String,
  expirationTime: Number,
  keys: {
    p256dh: String,
    auth: String
  }
});

const model = mongoose.model('Subscriptions', subscriptionSchema);

module.exports = model;

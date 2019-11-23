const mongoose = require('mongoose');
const statistics = require('./statistics');
const appkeeps = require('./appkeeps');
const options = require('./options');
const users = require('./users');
const notifications = require('./notifications');

module.exports = function (app) {

  require('dotenv').config();

  const mongoDBUri = process.env.MONGODB_URI;

  mongoose.connect(mongoDBUri, {useNewUrlParser: true}, function (err, res) {
    if (err) {
      console.log('Error connecting to MongoDB server.', err);
    } else {
      console.log('Connected to MongoDB server.');
    }
  });

  appkeeps(app);
  statistics(app);
  options(app);
  users(app);
  notifications(app);
};

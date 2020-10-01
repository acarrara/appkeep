const mongoose = require('mongoose');
const jobs = require('./api/utils/jobs');

module.exports = {
  run: function () {
    require('dotenv').config();

    const mongoDBUri = process.env.DB_URI;

    mongoose.connect(mongoDBUri, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, res) {
      if (err) {
        console.log('Error connecting to MongoDB server.', err);
      } else {
        console.log('Connected to MongoDB server.');

        jobs.storeMonthlyAppKeeps().then(() => {
          console.log('Stored monthly appkeeps.');
          mongoose.disconnect(() => console.log('Disconnected from MongoDB server.'))
        }).catch(() => {
          console.log('Cannot store monthly appkeeps');
          mongoose.disconnect(() => console.log('Disconnected from MongoDB server.'))
        });
      }
    });
  }
}

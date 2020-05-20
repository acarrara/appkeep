const jobs = require('./api/utils/jobs');

module.exports = {
  run: function () {
    jobs.storeMonthlyAppKeeps();
    console.log('Stored monthly appkeeps');
  }
}

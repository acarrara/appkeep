const CronJob = require('cron').CronJob;
const storeMonthlyAppKeeps = require('./storeMonthlyAppKeeps.js');

const job = new CronJob({
  cronTime: '* * * * *',
  onTick: storeMonthlyAppKeeps.sayHello(),
  start: true,
  timeZone: 'Europe/Rome'
});

job.start();

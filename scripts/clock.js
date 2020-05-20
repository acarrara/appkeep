const CronJob = require('cron').CronJob;
const storeMonthlyAppKeeps = require('./storeMonthlyAppKeeps.js');

new CronJob({
  cronTime: '* * * * *',
  onTick: () => storeMonthlyAppKeeps.run(),
  start: true,
  timeZone: 'Europe/Rome'
});

const CronJob = require('cron').CronJob;
const storeMonthlyAppKeeps = require('./storeMonthlyAppKeeps.js');

new CronJob({
  cronTime: '*/10 * * * *',
  onTick: () => storeMonthlyAppKeeps.run(),
  start: true,
  timeZone: 'Europe/Rome'
});

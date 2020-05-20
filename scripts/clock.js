const CronJob = require('cron').CronJob;
const storeMonthlyAppKeeps = require('./storeMonthlyAppKeeps.js');

new CronJob({
  cronTime: '0 3 1 * *',
  onTick: () => storeMonthlyAppKeeps.run(),
  start: true,
  timeZone: 'Europe/Rome'
});

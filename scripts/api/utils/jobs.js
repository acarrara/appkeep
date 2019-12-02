const cron = require('node-schedule');
const MonthlyAppKeep = require('../schemas/MonthlyAppKeep');
const AppKeep = require('../schemas/AppKeep');

module.exports.scheduleMonthlyAppKeeps = async function () {

  async function storeNewAppKeep(monthlyAppKeep) {
    const appKeep = new AppKeep();
    appKeep.date = Date.now();
    appKeep.title = monthlyAppKeep.title;
    appKeep.category = monthlyAppKeep.category;
    appKeep.amount = monthlyAppKeep.amount;
    appKeep.user = monthlyAppKeep.user;
    await appKeep.save();
  }

  async function storeMonthlyAppKeeps() {
    const monthlyAppKeeps = await MonthlyAppKeep.find().exec();
    for (const monthlyAppKeep of monthlyAppKeeps) {
      storeNewAppKeep(monthlyAppKeep);
    }
  }

  // TODO: set to 0 8 1 * *
  cron.scheduleJob('0 8 3 * *', () => storeMonthlyAppKeeps());
};

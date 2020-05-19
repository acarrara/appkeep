const cron = require('node-schedule');
const MonthlyAppKeep = require('../schemas/MonthlyAppKeep');
const AppKeep = require('../schemas/AppKeep');

module.exports.storeMonthlyAppKeeps = async function () {

  async function storeNewAppKeep(monthlyAppKeep) {
    const appKeep = new AppKeep();
    appKeep.date = Date.now();
    appKeep.title = monthlyAppKeep.title;
    appKeep.category = monthlyAppKeep.category;
    appKeep.amount = monthlyAppKeep.amount;
    appKeep.income = monthlyAppKeep.income;
    appKeep.user = monthlyAppKeep.user;
    await appKeep.save();
  }

  async function storeMonthlyAppKeeps() {
    const monthlyAppKeeps = await MonthlyAppKeep.find().exec();
    for (const monthlyAppKeep of monthlyAppKeeps) {
      storeNewAppKeep(monthlyAppKeep);
    }
  }

  // cron.scheduleJob('0 3 1 * *', () => storeMonthlyAppKeeps());
  storeMonthlyAppKeeps();
};

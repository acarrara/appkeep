const dates = require('./utils/dates');
const AppKeep = require('./schemas/AppKeep');

module.exports = function (app) {

  app.get('/api/appkeeps/statistics/thismonth', async (request, response) => {
    try {
      const statistics = await AppKeep.monthStatistics(dates.currentMonth());
      statistics[0].users = await AppKeep.userStatistics(dates.currentMonth());
      response.send(statistics);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/appkeeps/statistics/thisyear', async (request, response) => {
    try {
      const range = dates.currentYear();
      const statistics = await AppKeep.yearStatistics(range);
      statistics[0].users = await AppKeep.userStatistics(range);
      statistics[0].categories = (await AppKeep.yearCategoryStatistics(range))[0].categories;
      response.send(statistics);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/appkeeps/statistics/overall', async (request, response) => {
    try {
      const statistics = await AppKeep.overallStatistics();
      response.send(statistics);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/appkeeps/statistics/:year', async (request, response) => {
    try {
      const range = dates.year(request.params.year);
      const statistics = await AppKeep.yearStatistics(range);
      statistics[0].users = await AppKeep.userStatistics(range);
      statistics[0].categories = (await AppKeep.yearCategoryStatistics(range))[0].categories;
      response.send(statistics);
    } catch (error) {
      console.log(error);
      response.status(500).send(error);
    }
  });

  app.get('/api/appkeeps/statistics/:year/:month', async (request, response) => {
    try {
      const range = dates.month(request.params.year, request.params.month);
      const statistics = await AppKeep.monthStatistics(range);
      statistics[0].users = await AppKeep.userStatistics(range);
      response.send(statistics);
    } catch (error) {
      console.log(error);
      response.status(500).send(error);
    }
  });

  app.get('/api/categories/:category/statistics/year', async (request, response) => {
    try {
      const statistics = await AppKeep.yearStatistics(dates.currentYear(), request.params.category);
      response.send(statistics);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/categories/:category/statistics/overall', async (request, response) => {
    try {
      const statistics = await AppKeep.overallStatistics(request.params.category);
      response.send(statistics);
    } catch (error) {
      response.status(500).send(error);
    }
  });
};

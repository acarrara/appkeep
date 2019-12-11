const dates = require('./utils/dates');
const AppKeep = require('./schemas/AppKeep');

module.exports = function (app) {

  app.get('/api/appkeeps/statistics', async (request, response) => {
    try {
      const statistics = await AppKeep.monthStatistics(dates.month('this'));
      const users = await AppKeep.userStatistics(dates.month('this'));
      statistics[0].users = users;
      response.send(statistics);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/appkeeps/statistics/year', async (request, response) => {
    try {
      const statistics = await AppKeep.yearStatistics(dates.year('this'));
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

  app.get('/api/categories/:category/statistics/year', async (request, response) => {
    try {
      const statistics = await AppKeep.yearStatistics(dates.year('this'), request.params.category);
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

const dates = require('./utils/dates');
const AppKeep = require('./schemas/AppKeep');

module.exports = function (app) {

  app.get('/api/appkeeps/statistics', async (request, response) => {
    try {
      const statistics = await AppKeep.statistics(dates.month('all'));
      response.send(statistics);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/appkeeps/statistics/month/:id', async (request, response) => {
    try {
      const statistics = await AppKeep.range(dates.month(request.params.id));
      response.send(statistics);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/appkeeps/statistics/year', async (request, response) => {
    try {
      const statistics = await AppKeep.yearStatistics(dates.year('last'));
      response.send(statistics);
    } catch (error) {
      response.status(500).send(error);
    }
  });
};
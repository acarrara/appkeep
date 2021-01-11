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
      const fullYear = new Date().getFullYear();
      const yearStatistics = statistics.find(current => current._id === fullYear);
      yearStatistics.users = await AppKeep.userStatistics(range);
      const categoryStatistics = await AppKeep.yearCategoryStatistics(range);
      const yearCategoryStatistics = categoryStatistics.find(current => current._id === fullYear);
      yearStatistics.categories = yearCategoryStatistics.categories;
      response.send(yearStatistics);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/appkeeps/statistics/overall', async (request, response) => {
    try {
      const range = dates.all();
      const statistics = await AppKeep.overallStatistics();
      const users = await AppKeep.userStatistics(range);
      const categories = await AppKeep.overallCategoryStatistics(range);
      response.send({statistics, users, categories});
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/appkeeps/statistics/:year', async (request, response) => {
    try {
      const range = dates.year(request.params.year);
      const statistics = await AppKeep.yearStatistics(range);
      const yearStatistics = statistics.find(current => current._id === Number(request.params.year));
      yearStatistics.users = await AppKeep.userStatistics(range);
      const categoryStatistics = await AppKeep.yearCategoryStatistics(range);
      const yearCategoryStatistics = categoryStatistics.find(current => current._id === Number(request.params.year));
      yearStatistics.categories = yearCategoryStatistics.categories;
      response.send(yearStatistics);
    } catch (error) {
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
      response.status(500).send(error);
    }
  });

  app.get('/api/categories/:category/statistics/year', async (request, response) => {
    try {
      const statistics = await AppKeep.yearStatistics(dates.currentYear(), request.params.category);
      response.send(statistics[0]);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/categories/:category/statistics/year/:year', async (request, response) => {
    try {
      const range = dates.year(request.params.year);
      const statistics = await AppKeep.yearStatistics(range, request.params.category);
      const yearStatistics = statistics.find(current => current._id === Number(request.params.year));
      response.send(yearStatistics);
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

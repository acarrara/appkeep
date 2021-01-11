const AppKeep = require('./schemas/AppKeep');
const dates = require('./utils/dates');
const matchers = require('./utils/matchers');

module.exports = function (app) {

  app.post('/api/appkeeps', async (request, response) => {
    try {
      const appKeep = new AppKeep(request.body);
      const result = await appKeep.save();
      const toSend = {...result._doc, date: result._doc.date.getTime()};
      response.send(toSend);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/appkeeps', async (request, response) => {
    try {
      const appKeeps = await AppKeep.aggregate([{
        $match: {
          'date': {
            $gte: dates.today()
          }
        },
      }
      ]).sort({date: -1}).exec();
      response.send(appKeeps);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/appkeeps/:id', async (request, response) => {
    try {
      const appKeep = await AppKeep.findById(request.params.id).exec();
      response.send(appKeep);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.put("/api/appkeeps/:id", async (request, response) => {
    try {
      const appKeep = await AppKeep.findById(request.params.id).exec();
      appKeep.set(request.body);
      const result = await appKeep.save();
      response.send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.delete("/api/appkeeps/:id", async (request, response) => {
    try {
      const appKeep = await AppKeep.deleteOne({_id: request.params.id}).exec();
      response.send(appKeep);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  function filterAppKeeps(range, category) {
    return AppKeep.aggregate([
      {
        $match: matchers.matchBy(range, category)
      },
      {
        $sort: {
          date: -1
        }
      },
      {
        $group: {
          _id: {
            month: {$month: "$date"},
          },
          appKeeps: {$push: "$$ROOT"}
        }
      }
    ]).exec();
  }

  app.get('/api/categories/:category', async (request, response) => {
    try {
      const range = dates.currentMonth();
      const appKeeps = await filterAppKeeps(range, request.params.category);
      response.send(appKeeps);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/categories/:category/:year/:month', async (request, response) => {
    try {
      const range = dates.month(request.params.year, request.params.month);
      const appKeeps = await filterAppKeeps(range, request.params.category);
      response.send(appKeeps);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/year/:year', async (request, response) => {
    try {
      const range = dates.year(request.params.year);
      const appKeeps = await filterAppKeeps(range);
      response.send(appKeeps);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/year/:year/:category', async (request, response) => {
    try {
      const range = dates.year(request.params.year);
      const appKeeps = await filterAppKeeps(range, request.params.category);
      response.send(appKeeps);
    } catch (error) {
      response.status(500).send(error);
    }
  });

};

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

  app.get('/api/categories/:category/appkeeps', async (request, response) => {
    try {
      const range = dates.month('all');
      const category = request.params.category;
      const appKeeps = await AppKeep.aggregate([
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
      response.send(appKeeps);
    } catch (error) {
      response.status(500).send(error);
    }
  });

};

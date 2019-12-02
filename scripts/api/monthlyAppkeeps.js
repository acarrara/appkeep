const AppKeep = require('./schemas/AppKeep');
const dates = require('./utils/dates');
const matchers = require('./utils/matchers');

module.exports = function (app) {

  app.post('/api/monthlyappkeeps', async (request, response) => {
    try {
      const appKeep = new AppKeep(request.body);
      const result = await appKeep.save();
      const toSend = {...result._doc, date: result._doc.date.getTime()};
      response.send(toSend);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/monthlyappkeeps', async (request, response) => {
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

  app.get('/api/monthlyappkeeps/:id', async (request, response) => {
    try {
      const appKeep = await AppKeep.findById(request.params.id).exec();
      response.send(appKeep);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.put("/api/monthlyappkeeps/:id", async (request, response) => {
    try {
      const appKeep = await AppKeep.findById(request.params.id).exec();
      appKeep.set(request.body);
      const result = await appKeep.save();
      response.send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.delete("/api/monthlyappkeeps/:id", async (request, response) => {
    try {
      const appKeep = await AppKeep.deleteOne({_id: request.params.id}).exec();
      response.send(appKeep);
    } catch (error) {
      response.status(500).send(error);
    }
  });
};

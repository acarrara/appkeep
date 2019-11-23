const AppKeep = require('./schemas/AppKeep');
const dates = require('./utils/dates');

module.exports = function (app) {

  app.post('/api/appkeeps', async (request, response) => {
    try {
      const appKeep = new AppKeep(request.body);
      const result = await appKeep.save();
      const toSend = {...result._doc, date: result._doc.date.getTime()}
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
      }, {
        $project: {
          'date': {
            $subtract: ["$date", new Date("1970-01-01")]
          },
          'title': true,
          'category': true,
          'amount': true,
          'user': true
        }
      }]).sort({date: -1}).exec();
      response.send(appKeeps);
    } catch (error) {
      console.log(error)
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

};

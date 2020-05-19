const MonthlyAppKeep = require('./schemas/MonthlyAppKeep');
const jobs = require('./utils/jobs');

module.exports = function (app) {

  app.post('/api/monthlyappkeeps', async (request, response) => {
    try {
      const monthlyAppKeep = new MonthlyAppKeep(request.body);
      const result = await monthlyAppKeep.save();
      const toSend = {...result._doc, date: result._doc.date.getTime()};
      response.send(toSend);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.post('/api/monthlyappkeeps/save', async (request, response) => {
    try {
      jobs.storeMonthlyAppKeeps();
      response.sendStatus(200);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/monthlyappkeeps', async (request, response) => {
    try {
      const monthlyAppKeeps = await MonthlyAppKeep.find().exec();
      response.send(monthlyAppKeeps);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/monthlyappkeeps/:id', async (request, response) => {
    try {
      const monthlyAppKeep = await MonthlyAppKeep.findById(request.params.id).exec();
      response.send(monthlyAppKeep);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.put("/api/monthlyappkeeps/:id", async (request, response) => {
    try {
      const monthlyAppKeep = await MonthlyAppKeep.findById(request.params.id).exec();
      monthlyAppKeep.set(request.body);
      const result = await monthlyAppKeep.save();
      response.send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.delete("/api/monthlyappkeeps/:id", async (request, response) => {
    try {
      const monthlyAppKeep = await MonthlyAppKeep.deleteOne({_id: request.params.id}).exec();
      response.send(monthlyAppKeep);
    } catch (error) {
      response.status(500).send(error);
    }
  });
};

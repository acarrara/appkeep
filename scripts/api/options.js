const Option = require('./schemas/Option');

module.exports = function (app) {

  app.post('/api/options', async (request, response) => {
    try {
      const option = new Option(request.body);
      const result = await option.save();
      response.send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/options', async (request, response) => {
    try {
      const options = await Option.find().exec();
      response.send(options);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.put("/api/options/:id", async (request, response) => {
    try {
      const option = await Option.findById(request.params.id).exec();
      option.set(request.body);
      const result = await option.save();
      response.send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  });

};

const mongoose = require('mongoose');
const dates = require('./dates');
const AppKeep = require('./AppKeep');
const Option = require('./Option');

module.exports = function (app) {

  require('dotenv').config();

  const mongoDBUri = process.env.MONGODB_URI;

  mongoose.connect(mongoDBUri, {useNewUrlParser: true}, function (err, res) {
    if (err) {
      console.log('Error connecting to MongoDB server.', err);
    } else {
      console.log('Connected to MongoDB server.');
    }
  });

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
        }
      }]).sort({date: -1}).exec();
      response.send(appKeeps);
    } catch (error) {
      console.log(error)
      response.status(500).send(error);
    }
  });

  app.get('/api/appkeeps/statistics', async (request, response) => {
    try {
      const statistics = await AppKeep.statistics(dates.month('all'));
      response.send(statistics);
    } catch (error) {
      console.log(error);
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

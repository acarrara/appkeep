const mongoose = require('mongoose');

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

  const appKeepSchema = new mongoose.Schema({
    title: {type: String, trim: true},
    type: String,
    date: {type: Number, min: 0},
    amount: {type: Number, min: 0}
  });

  const AppKeep = mongoose.model('AppKeeps', appKeepSchema);

  app.post('/api/appkeeps', async (request, response) => {
    try {
      const appKeep = new AppKeep(request.body);
      const result = await appKeep.save();
      response.send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/appkeeps', async (request, response) => {
    function getMidnight() {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    }

    try {
      const appKeeps = await AppKeep.find({
        'date': {
          $gte: getMidnight()
        }
      }).sort({date: -1}).exec();
      response.send(appKeeps);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/appkeeps/statistics', async (request, response) => {

    function getStartOfMonth() {
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      firstDay.setUTCHours(0, 0, 0, 0);
      console.log(date, firstDay);
      return firstDay.getTime();
    }

    try {
      const statistics = await AppKeep.aggregate(
        [{
          $match: {
            'date': {
              $gte: getStartOfMonth()
            }
          }
        },
          {
            $group: {
              _id: "$thisMonth",
              total: {$sum: '$amount'}
            }
          }]
      ).exec();
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
};

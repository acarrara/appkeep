const User = require('./schemas/User');

module.exports = function (app) {

  app.put("/api/users/:id", async (request, response) => {
    try {
      const user = await User.findById(request.params.id).exec();
      user.set(request.body);
      const result = await user.save();
      response.send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.post('/api/users', async (request, response) => {
    try {
      const user = new User(request.body);
      const result = await user.save();
      response.send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/users', async (request, response) => {
    try {
      const users = await User.find().exec();
      response.send(users);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.delete("/api/users/:id", async (request, response) => {
    try {
      const user = await User.deleteOne({_id: request.params.id}).exec();
      response.send(user);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.put("/api/categories/:id", async (request, response) => {
    try {
      const user = await User.findById(request.params.id).exec();
      user.set(request.body);
      const result = await user.save();
      response.send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  });
};

const Category = require('./schemas/Category');

module.exports = function (app) {

  app.post('/api/categories', async (request, response) => {
    try {
      const category = new Category(request.body);
      const result = await category.save();
      response.send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get('/api/categories', async (request, response) => {
    try {
      const categories = await Category.find().exec();
      response.send(categories);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.put("/api/categories/:id", async (request, response) => {
    try {
      const category = await Category.findById(request.params.id).exec();
      category.set(request.body);
      const result = await category.save();
      response.send(result);
    } catch (error) {
      response.status(500).send(error);
    }
  });

};

const jwt = require('../api/utils/jwt.js');
const authMiddleware = require('../api/utils/auth-middleware');

module.exports = function (app) {
  app.use(authMiddleware);

  app.post('/auth', (req, res) => {
    const token = jwt.generateToken({id: 'e2e-test-user', email: 'e2e@appkeep.test'});
    res.send({apiToken: token, user: {email: 'e2e@appkeep.test', name: 'E2E User', hue: 0}});
  });
};
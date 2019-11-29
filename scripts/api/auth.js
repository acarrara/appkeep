const {OAuth2Client} = require('google-auth-library');
const jwt = require('./jwt.js');
const authMiddleware = require('./auth-middleware');
const User = require('./schemas/User');

module.exports = function (app) {

  app.use(authMiddleware);

  const clientID = process.env.clientID;
  const oauthClient = new OAuth2Client(clientID, '', '');

  function getUserEmail(idToken) {
    return oauthClient.verifyIdToken({idToken: idToken, audience: clientID}).then(login => {
      const payload = login.getPayload();

      const audience = payload.aud;
      if (audience !== clientID) {
        throw new Error("Error while authenticating google user: audience mismatch: wanted [" + clientID + "] but was [" + audience + "]")
      }

      return {id: payload.sub, email: payload.email};
    }).catch(err => {
      throw new Error("Error while authenticating google user: " + JSON.stringify(err));
    });
  }

  app.post('/auth', (request, response) => {
    try {
      const token = request.body.token;
      getUserEmail(token).then(user => {
        User.countDocuments({email: user.email}).then(usersCount => {
          const authorized = !!usersCount;
          if (authorized) {
            response.send(JSON.stringify(jwt.generateToken(user)));
          } else {
            response.status(403).send('User unauthorized. Not a friend');
          }
        });
      }).catch(e => {
        console.error(e);
        throw new Error(e);
      });
    } catch (error) {
      response.status(500).send(error);
    }
  });
};

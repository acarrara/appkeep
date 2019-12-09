const {OAuth2Client} = require('google-auth-library');
const jwt = require('./utils/jwt.js');
const authMiddleware = require('./utils/auth-middleware');
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

      return {id: payload.sub, email: payload.email, name: payload.given_name};
    }).catch(err => {
      throw new Error("Error while authenticating google user: " + JSON.stringify(err));
    });
  }

  async function updateName(user) {
    const storedUser = await User.findOne({email: user.email}).exec();
    if (!storedUser.name) {
      storedUser.name = user.name;
      return await storedUser.save();
    } else {
      return storedUser;
    }
  }

  app.post('/auth', (request, response) => {
    try {
      const token = request.body.token;
      getUserEmail(token).then(user => {
        User.countDocuments({email: user.email}).then(usersCount => {
          const authorized = !!usersCount;
          if (authorized) {
            updateName(user).then(storedUser => {
              response.send({user: storedUser, apiToken: jwt.generateToken(user)});
            });
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

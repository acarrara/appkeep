const {OAuth2Client} = require('google-auth-library');
const jwt = require('./jwt.js');
const authMiddleware = require('./auth-middleware');
const User = require('./schemas/User');

module.exports = function (app) {

  const clientID = process.env.clientID;
  const client = new OAuth2Client(clientID, '', '');

  function createApiToken(user) {
    return jwt.generateToken(user);
  }

  function getGoogleUser(idToken) {
    //verify the token using google client
    return client.verifyIdToken({idToken: idToken, audience: clientID})
      .then(login => {
        //if verification is ok, google returns a jwt
        var payload = login.getPayload();

        //check if the jwt is issued for our client
        var audience = payload.aud;
        if (audience !== clientID) {
          throw new Error("error while authenticating google user: audience mismatch: wanted [" + clientID + "] but was [" + audience + "]")
        }
        //promise the creation of a user
        return {
          name: payload['name'], //profile name
          pic: payload['picture'], //profile pic
          id: payload['sub'], //google id
          email_verified: payload['email_verified'],
          email: payload['email']
        }
      })
      .then(user => {
        return user;
      })
      .catch(err => {
        //throw an error if something goes wrong
        throw new Error("error while authenticating google user: " + JSON.stringify(err));
      });
  }

  app.use(authMiddleware);

  app.post('/auth', (request, response) => {
    try {
      const token = request.body.token;
      getGoogleUser(token)
        .then(user => {
          User.countDocuments({
            email: user.email
          }).then(usersCount => {
            const authorized = !!usersCount;
            if (authorized) {
              response.send(JSON.stringify(createApiToken(user)));
            } else {
              response.status(403).send('unauthorized');
            }
          });
        })
        .catch(e => {
          console.error(e);
          throw new Error(e);
        });
    } catch (error) {
      response.status(500).send(error);
    }
  });
};

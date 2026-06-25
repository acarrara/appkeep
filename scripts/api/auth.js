const https = require('https');
const jwt = require('./utils/jwt.js');
const authMiddleware = require('./utils/auth-middleware');
const User = require('./schemas/User');

module.exports = function (app) {

  app.use(authMiddleware);

  const clientID = process.env.clientID;

  function getUserEmail(idToken) {
    return new Promise((resolve, reject) => {
      const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const payload = JSON.parse(data);
            if (payload.error) {
              return reject(new Error("Error while authenticating google user: " + payload.error_description));
            }
            if (payload.aud !== clientID) {
              return reject(new Error("Error while authenticating google user: audience mismatch: wanted [" + clientID + "] but was [" + payload.aud + "]"));
            }
            resolve({id: payload.sub, email: payload.email, name: payload.given_name});
          } catch (e) {
            reject(new Error("Error while authenticating google user: failed to parse tokeninfo response"));
          }
        });
      }).on('error', (e) => {
        reject(new Error("Error while authenticating google user: " + e.message));
      });
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

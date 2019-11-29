const jwt = require('./jwt');

const checkToken = request => {
  const authorization = request.get('apiAuthorization');
  if (!authorization) {
    throw new Error('No apiAuthorization header');
  }

  let token = authorization.replace('Bearer ', '');
  return jwt.verify(token);
};

const authMiddleware = (request, response, next) => {
  try {
    const apiRequest = request.url.startsWith('/api');
    if (apiRequest) {
      response.locals.principal = checkToken(request);
    }
    next();
  } catch (e) {
    response.status(401).send(e);
  }
};

module.exports = authMiddleware;

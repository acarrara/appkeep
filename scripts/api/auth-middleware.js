const jwt = require('./jwt');

const checkToken = request => {
  //get the http header 'authorization'
  let authorization = request.get('apiAuthorization');
  if (!authorization) {
    throw new Error(401);
  }
  //check the token signature with 'jwt.js' library
  let token = authorization.replace('Bearer ', '');
  return jwt.verify(token);
}

const authMiddleware = (request, response, next) => {
  try {
    const protected = request.url.startsWith('/api');
    //add a configuration to protect some resources
    if (protected) {
      //if the url is protected we must check the token
      response.locals.principal = checkToken(request);
    }
    next();
  } catch (e) {
    //if any error occurs, we do not authorize the request
    console.log("Unauthorized", e)
    response
      .status(401)
      .send(e);
  }
}

module.exports = authMiddleware;

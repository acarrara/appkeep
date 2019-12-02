const jwt = require('jsonwebtoken');

module.exports.verify = (token) => {
  try {
    return jwt.verify(token, process.env.APPKEEP_PUBLIC_KEY.replace(/\\n/g, '\n'), {algorithms: ['RS256']});
  } catch (e) {
    throw new Error('jwt token not verified');
  }
};

module.exports.generateToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      exp: Math.floor(Date.now() / 1000) + (60 * 60)
    },
    process.env.APPKEEP_PRIVATE_KEY.replace(/\\n/g, '\n'),
    {algorithm: 'RS256'}
  );
};

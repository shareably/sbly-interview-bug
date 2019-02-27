module.exports = (req, res, next) => {
  const authorizationHeader = req.header('Authorization');
  req.session = {};

  if (authorizationHeader && authorizationHeader.includes('SHAREABLY_SECRET_TOKEN')) {
    req.session.role = 'admin';
    return next();
  }

  if (req.query.accessToken === 'SHAREABLY_SECRET_TOKEN') {
    req.session.role = 'admin';
    return next();
  }

  req.session.role = 'guest';
  next();
};

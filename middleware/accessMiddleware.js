var acl = require('acl');
acl = new acl(new acl.memoryBackend());

acl.allow([
  {
    roles: 'guest',
    allows: []
  }
]);

acl.addUserRoles('guest', 'guest');

module.exports = (resource) => (req, res, next) => {
  // do not validate admins
  if (req.session.role === 'admin') {
    return next();
  }

  acl.isAllowed(req.session.role, resource, req.method.toUpperCase(), (err, allowed) => {
    if (err) {
      return next(err);
    }

    if (!allowed && req.session.role !== 'guest') {
      const forbiddenError = {'status': 403};
      return next(forbiddenError);
    } else if (!allowed) {
      const unauthenticatedError = {'status': 401};
      return next(unauthenticatedError);
    }
  
    next();
  })
}

'use strict';

module.exports = (isNeedAdminRole = false) => (req, res, next) => {
  const {user} = req.session;

  if (!user) {
    return res.redirect(`/login`);
  }

  if (isNeedAdminRole && !user.isAdmin) {
    return res.render(`errors/400`);
  }

  return next();
};

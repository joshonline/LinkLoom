exports.ensureAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/users/login");
  }
  next();
};

exports.ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/bookmarks");
  }
  next();
};

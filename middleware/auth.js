exports.ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/users/login");
};

exports.ensureGuest = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/resumes");
  }
  next();
};

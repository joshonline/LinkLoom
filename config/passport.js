const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/usersModel");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "username" },
      async (username, password, done) => {
        try {
          const user = await User.findOne({
            $or: [{ username: username }, { email: username }],
          });

          if (!user) {
            return done(null, false, { message: "User not found" });
          }

          const isMatch = await user.validatePassword(password);

          if (!isMatch) {
            return done(null, false, { message: "Invalid password" });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

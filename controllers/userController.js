const User = require("../models/usersModel");
const Collection = require("../models/collectionModel");
const passport = require("passport");

// GET /signup
exports.getSignup = (req, res) => {
  res.render("users/signup", { title: "Sign Up", error: null });
};

// POST /signup (email, username, displayName, password)
exports.postSignup = async (req, res) => {
  try {
    // console.log(req.body)
    const { email, username, displayName, password, password2 } = req.body;

    if (!email || !username || !password || !password2) {
      return res.status(400).render("users/signup", {
        error: "Email, username and password are required.",
        title: "Sign Up",
      });
    }

    if (password !== password2) {
      return res.render("users/signup", {
        title: "Sign Up",
        error: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).render("users/signup", {
        error: "Email or username already in use.",
        title: "Sign Up",
      });
    }

    // Create user
    const user = new User({
      email,
      username,
      displayName,
    });

    await user.setPassword(password);
    await user.save();

    const defaultCollection = new Collection({
      user: user._id,
      name: "Default Collection",
      description: "Your default bookmark collection",
      isPublic: false,
      color: "#ccc",
    });

    await defaultCollection.save();
    // Log the user in i.e. create session
    // req.session.userId = user._id;

    req.login(user, (err) => {
      if (err) {
        console.error(err);
        return res.redirect("/users/login");
      }
      return res.redirect("/");
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("users/signup", {
      error: "Internal Server Error",
      title: "Sign Up",
    });
  }
};

// GET /login
exports.getLogin = (req, res) => {
  res.render("users/login", { title: "Log In" });
};

// POST /login (username-Or-Email, pass)
exports.postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.render("users/login", {
        title: "Log In",
        error: info?.message || "Invalid login credentials",
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
};

// GET /logout
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Could not log out.");
      }
      res.clearCookie("connect.sid");
      res.redirect("/users/login");
    });
  });
};

// GET /profile
exports.getProfile = async (req, res) => {
  if (!req.user) return res.redirect("uses/login");

  res.render("users/profile", {
    title: "Profile",
    user: req.user,
    error: null,
  });
};

// TASK: Add POST profile handler
// POST /profile - update user profile
exports.postProfile = async (req, res) => {
  if (!req.user) return res.redirect("users/login");

  try {
    const { displayName, email } = req.body;

    // Check for required fields
    if (!email || !displayName) {
      return res.status(400).render("users/profile", {
        error: "Email and display name are required.",
        title: "Your Profile",
        user: req.user,
      });
    }

    const user = await User.findById(req.user._id);

    // Update fields
    user.email = email;
    user.displayName = displayName;

    await user.save();

    res.redirect("users/profile");
  } catch (err) {
    console.error(err);
    res.status(500).render("users/profile", {
      error: "Internal Server Error",
      title: "Your Profile",
      user: req.user,
      // user: await User.findById(req.user._id),
    });
  }
};

const User = require("../models/usersModel");

// GET /signup
exports.getSignup = (req, res) => {
  res.render("signup", { title: "Sign Up" });
};

// POST /signup (email, username, displayName, password)
exports.postSignup = async (req, res) => {
  try {
    const { email, username, displayName, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).render("signup", {
        error: "Email, username and password are required.",
        title: "Sign Up",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).render("signup", {
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

    // Log the user in i.e. create session
    req.session.userId = user._id;

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).render("signup", {
      error: "Internal Server Error",
      title: "Sign Up",
    });
  }
};

// GET /login
exports.getLogin = (req, res) => {
  res.render("login", { title: "Log In" });
};

// POST /login (username-Or-Email, pass)
exports.postLogin = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).render("login", {
        error: "Username/email and password are required.",
        title: "Log In",
      });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(401).render("login", {
        error: "Invalid credentials.",
        title: "Log In",
      });
    }

    const valid = await user.validatePassword(password);
    if (!valid) {
      return res.status(401).render("login", {
        error: "Invalid credentials.",
        title: "Log In",
      });
    }

    // Valid login - create session
    req.session.userId = user._id;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).render("login", {
      error: "Internal Server Error",
      title: "Log In",
    });
  }
};

// GET /logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Could not log out.");
    }
    // clear session cookie
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
};

// GET /profile
exports.getProfile = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  try {
    const user = await User.findById(req.session.userId).select(
      "-passwordHash"
    );
    if (!user) {
      return res.redirect("/login");
    }
    res.render("profile", { user, title: "Your Profile" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// TASK: Add POST profile handler

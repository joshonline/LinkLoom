const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET /users/ - redirect dashboard if logged in
router.get("/", (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect("/bookmarks/list");
  }
  res.redirect("/users/login");
});

// GET /users/signup
router.get("/signup", userController.getSignup);

// POST /users/signup
router.post("/signup", userController.postSignup);

// GET /users/login
router.get("/login", userController.getLogin);

// POST /users/login
router.post("/login", userController.postLogin);

// POST /users/logout
router.post("/logout", userController.logout);

// GET /users/profile
router.get("/profile", userController.getProfile);

// POST /users/profile
router.post("/profile", userController.postProfile);

module.exports = router;

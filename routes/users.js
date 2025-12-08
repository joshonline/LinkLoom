const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { ensureAuth } = require("../middleware/auth");

// GET /users/ - redirect dashboard if logged in
router.get("/", (req, res) => {
  return res.redirect("/users/profile");
});

// GET /users/signup
router.get("/signup", userController.getSignup);

// POST /users/signup
router.post("/signup", userController.postSignup);

// GET /users/login
router.get("/login", userController.getLogin);

// POST /users/login
router.post("/login", userController.postLogin);

// get /users/logout
router.get("/logout", userController.logout);

// GET /users/profile
router.get("/profile", ensureAuth, userController.getProfile);

// POST /users/profile
router.post("/profile", ensureAuth, userController.postProfile);

module.exports = router;

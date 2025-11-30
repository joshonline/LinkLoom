const express = require("express");
const router = express.Router();
const bookmarkController = require("../controllers/bookmarkController");
const { ensureAuth } = require("../middleware/auth");

// GET /bookmarks/ - redirect to /bookmarks/list
router.get("/", (req, res) => {
  res.redirect("/bookmarks/list");
  // If no user, load only private version of page
  // If user, load private and public version of page
});

// GET /bookmarks/list - list all bookmarks (dashboard)
router.get("/list", bookmarkController.listBookmarks);

// GET /bookmarks/create - show bookmark creation page
router.get("/create", ensureAuth, bookmarkController.getCreateBookmark);

// POST /bookmarks/create - create new bookmark
router.post("/create", ensureAuth, bookmarkController.postCreateBookmark);

// GET /bookmarks/:id - get specific bookmark by id
router.get("/:id", ensureAuth, bookmarkController.getBookmark);

// GET /bookmarks/:id/edit - get bookmark edit page
router.get("/:id/edit", ensureAuth, bookmarkController.getEditBookmark);

// POST /bookmarks/:id/edit - update bookmark and redirect
router.post("/:id/edit", ensureAuth, bookmarkController.postEditBookmark);

// POST /bookmarks/:id/delete - delete specific bookmark and redirect
router.post("/:id/delete", ensureAuth, bookmarkController.deleteBookmark);

module.exports = router;

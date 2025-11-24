const express = require("express");
const router = express.Router();
const bookmarkController = require("../controllers/bookmarkController");

// GET /bookmarks/ - redirect to /bookmarks/list
router.get("/", (req, res) => {
  res.redirect("/bookmarks/list");
});

// GET /bookmarks/list - list all bookmarks (dashboard)
router.get("/list", bookmarkController.listBookmarks);

// GET /bookmarks/create - show bookmark creation page
router.get("/create", bookmarkController.getCreateBookmark);

// POST /bookmarks/create - create new bookmark
router.post("/create", bookmarkController.postCreateBookmark);

// GET /bookmarks/:id - get specific bookmark by id
router.get("/:id", bookmarkController.getBookmark);

// GET /bookmarks/:id/edit - get bookmark edit page
router.get("/:id/edit", bookmarkController.getEditBookmark);

// POST /bookmarks/:id/edit - update bookmark and redirect
router.post("/:id/edit", bookmarkController.postEditBookmark);

// POST /bookmarks/:id/delete - delete specific bookmark and redirect
router.post("/:id/delete", bookmarkController.deleteBookmark);

module.exports = router;

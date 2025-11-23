const Bookmark = require("../models/collectionModel");

// GET /bookmarks
exports.listBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.session.userId }).populate("collections").exec();
    res.render("bookmarks/list", { bookmarks, title: "Your Bookmarks" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error loading bookmarks.");
  }
};

// GET /bookmarks/:id (bookmark_id)
exports.getBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ _id: req.params.id, user: req.session.userId }).populate("collections").exec();
    if (!bookmark) {
      return res.status(404).send("Bookmark not found");
    }
    res.render("bookmarks/detail", { bookmark, title: bookmark.title || "Bookmark Detail" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error loading bookmark.");
  }
};

// GET /bookmarks/new
exports.getCreateForm = async (req, res) => {
  // Need to pre-load user collections
  res.render("bookmarks/create", { title: "Add New Bookmark" });
};

// POST /bookmarks (url, title, description, favicon, tags, collections)
exports.createBookmark = async (req, res) => {
  try {
    const { url, title, description, faviconUrl, tags, collections } = req.body;

    const bookmark = new Bookmark({
      user: req.session.userId,
      url,
      title,
      description,
      faviconUrl,
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
      collections: collections ? collections.split(",") : [],
    });

    await bookmark.save();
    res.redirect("/bookmarks");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating bookmark.");
  }
};

// GET /bookmarks/:id/edit (bookmark_id)
exports.getEditForm = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ _id: req.params.id, user: req.session.userId });
    if (!bookmark) {
      return res.status(404).send("Bookmark not found");
    }
    res.render("bookmarks/edit", { bookmark, title: "Edit Bookmark" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading bookmark for editing.");
  }
};

// POST /bookmarks/:id (bookmark_id)
exports.updateBookmark = async (req, res) => {
  try {
    const { url, title, description, faviconUrl, tags, collections } = req.body;
    const bookmark = await Bookmark.findOne({ _id: req.params.id, user: req.session.userId });
    if (!bookmark) {
      return res.status(404).send("Bookmark not found");
    }

    bookmark.url = url;
    bookmark.title = title;
    bookmark.description = description;
    bookmark.faviconUrl = faviconUrl;
    bookmark.tags = tags ? tags.split(",").map(t => t.trim()) : [];
    bookmark.collections = collections ? collections.split(",") : [];

    await bookmark.save();
    res.redirect("/bookmarks");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating bookmark.");
  }
};

// POST /bookmarks/:id/delete (bookmark_id)
exports.deleteBookmark = async (req, res) => {
  try {
    await Bookmark.deleteOne({ _id: req.params.id, user: req.session.userId });
    res.redirect("/bookmarks");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting bookmark.");
  }
};

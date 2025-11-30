const Bookmark = require("../models/bookmarkModel");
const Collection = require("../models/collectionModel");
const mongoose = require("mongoose");

// GET /bookmarks OR GET /bookmarks/list
exports.listBookmarks = async (req, res) => {
  // TASK: public and private versions
  try {
    const bookmarks = await Bookmark.find({ user: req.session.userId })
      .populate("collections")
      .exec();
    res.render("bookmarks/list", { bookmarks, title: "Your Bookmarks" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error loading bookmarks.");
  }
};

// GET /bookmarks/create
exports.getCreateBookmark = async (req, res) => {
  try {
    const collections = await Collection.find({
      user: req.session.userId,
    }).exec();

    res.render("bookmarks/create", { title: "Add New Bookmark", collections });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading collections for bookmark creation.");
  }
};

// POST /bookmarks/create (url, title, description, favicon, tags, collections)
exports.postCreateBookmark = async (req, res) => {
  try {
    const { url, title, description, faviconUrl, tags } = req.body;

    let collectionsInput = req.body.collections;
    let collections = [];

    if (collectionsInput) {
      if (!Array.isArray(collectionsInput)) {
        collectionsInput = [collectionsInput];
      }
      collections = collectionsInput.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
    }

    const bookmark = new Bookmark({
      user: req.session.userId,
      url,
      title,
      description,
      faviconUrl,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      collections,
    });

    await bookmark.save();
    res.redirect("/bookmarks");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating bookmark.");
  }
};

// GET /bookmarks/:id (bookmark_id)
exports.getBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.session.userId,
    })
      .populate("collections")
      .exec();
    if (!bookmark) {
      return res.status(404).send("Bookmark not found");
    }
    res.render("bookmarks/detail", {
      bookmark,
      title: bookmark.title || "Bookmark Detail",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error loading bookmark.");
  }
};

// GET /bookmarks/:id/edit (bookmark_id)
exports.getEditBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.session.userId,
    });
    if (!bookmark) {
      return res.status(404).send("Bookmark not found");
    }
    res.render("bookmarks/edit", { bookmark, title: "Edit Bookmark" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading bookmark for editing.");
  }
};

// POST /bookmarks/:id (bookmark_id, title, description, faviconUrl, tags, collections)
exports.postEditBookmark = async (req, res) => {
  try {
    const { url, title, description, faviconUrl, tags, collections } = req.body;

    if (collections) {
      let collectionsArr = collections;
      if (!Array.isArray(collectionsArr)) {
        collectionsArr = [collectionsArr];
      }
      bookmark.collections = collectionsArr.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
    } else {
      bookmark.collections = [];
    }

    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.session.userId,
    });
    if (!bookmark) {
      return res.status(404).send("Bookmark not found");
    }

    bookmark.url = url;
    bookmark.title = title;
    bookmark.description = description;
    bookmark.faviconUrl = faviconUrl;
    bookmark.tags = tags ? tags.split(",").map((t) => t.trim()) : [];
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
    //TASK: Need to update collections
    res.redirect("/bookmarks");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting bookmark.");
  }
};

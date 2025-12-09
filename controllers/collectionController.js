const Collection = require("../models/collectionModel");
const Bookmark = require("../models/bookmarkModel");

// GET /collections
exports.listCollections = async (req, res) => {
  try {
    const collections = await Collection.find({
      $or: [{ user: req.user._id }, { isPublic: true }],
    }).exec();
    res.render("collections/list", { collections, title: "Your Collections" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error loading collections.");
  }
};

// GET /collections/create
exports.getCreateCollection = (req, res) => {
  res.render("collections/create", { title: "Create New Collection" });
};

// POST /collections/create
exports.postCreateCollection = async (req, res) => {
  try {
    const { name, description, isPublic, color } = req.body;

    const collection = new Collection({
      user: req.user._id,
      name,
      description,
      isPublic: isPublic === "on" ? true : false,
      color: color || null,
    });

    await collection.save();
    res.redirect("/collections");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating collection.");
  }
};

// GET /collections/:id (collection_id)
exports.getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!collection) {
      return res.status(404).send("Collection not found");
    }
    // retrieve bookmarks in collection
    const bookmarks = await Bookmark.find({ collections: collection._id });
    res.render("collections/detail", {
      collection: { ...collection.toObject(), bookmarks },
      title: collection.name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error loading collection.");
  }
};

// GET /collections/:id/edit (collection_id)
exports.getEditCollection = async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!collection) {
      return res.status(404).send("Collection not found");
    }
    res.render("collections/edit", { collection, title: "Edit Collection" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading collection for editing.");
  }
};

// POST /collections/:id (collection_id, name, description, isPublic, color)
exports.postEditCollection = async (req, res) => {
  try {
    const { name, description, isPublic, color } = req.body;

    const collection = await Collection.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!collection) {
      return res.status(404).send("Collection not found");
    }

    collection.name = name;
    collection.description = description;
    collection.isPublic = isPublic === "on" ? true : false;
    collection.color = color || null;

    await collection.save();
    res.redirect("/collections");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating collection.");
  }
};

// POST /collections/:id/delete (collection_id)
exports.deleteCollection = async (req, res) => {
  try {
    await Collection.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    });
    // TASK: Remove collection reference from Bookmarks
    await Bookmark.updateMany(
      { collections: req.params.id },
      { $pull: { collections: req.params.id } }
    );
    res.redirect("/collections");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting collection.");
  }
};

// -----SLUG Handlers-----
// GET /slug/:slug
exports.getCollectionBySlug = async (req, res) => {
  try {
    const collection = await Collection.findOne({
      user: req.user._id,
      slug: req.params.slug,
    });

    if (!collection) {
      return res.status(404).render("404", { message: "Collection not found" });
    }

    res.render("collections/detail", { collection });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// GET /slug/:slug/edit
//TASK: Add GET slug/:slug/edit
// POST /slug/:slug/edit
// TASK: Add POST /slug/:slug/edit

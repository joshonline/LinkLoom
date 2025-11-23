const Collection = require("../models/collectionModel");
const Bookmark = require("../models/bookmarkModel");

// GET /collections 
exports.listCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.session.userId }).exec();
    res.render("collections/list", { collections, title: "Your Collections" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error loading collections.");
  }
};


// GET /collections/new
exports.getCreateForm = (req, res) => {
  res.render("collections/create", { title: "Create New Collection" });
};

// POST /collections/new
exports.createCollection = async (req, res) => {
  try {
    const { name, description, isPublic, color } = req.body;

    const collection = new Collection({
      user: req.session.userId,
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
exports.getCollection = async (req, res) => {
  try {
    const collection = await Collection.findOne({ _id: req.params.id, user: req.session.userId })
      .populate("bookmarks")
      .exec();
    if (!collection) {
      return res.status(404).send("Collection not found");
    }
    // Need to retrieve bookmarks in collection
    res.render("collections/detail", { collection, title: collection.name });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error loading collection.");
  }
};

// GET /collections/:id/edit (collection_id)
exports.getEditForm = async (req, res) => {
  try {
    const collection = await Collection.findOne({ _id: req.params.id, user: req.session.userId });
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
exports.updateCollection = async (req, res) => {
  try {
    const { name, description, isPublic, color } = req.body;

    const collection = await Collection.findOne({ _id: req.params.id, user: req.session.userId });
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
    await Collection.deleteOne({ _id: req.params.id, user: req.session.userId });
    // Remove collection reference from Bookmarks
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

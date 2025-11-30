const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/collectionController");
const { ensureAuth } = require("../middleware/auth");

// GET /collections/ - redirect to /collections/list
router.get("/", (req, res) => {
  res.redirect("/collections/list");
});

// GET /collections/list - list all collections
router.get("/list", ensureAuth, collectionController.listCollections);

// GET /collections/create - show collection creation page
router.get("/create", ensureAuth, collectionController.getCreateCollection);

// POST /collections/create - create new collection
router.post("/create", ensureAuth, collectionController.postCreateCollection);

// GET /collections/slug/:slug - get specific collection by slug
router.get("/slug/:slug", ensureAuth, collectionController.getCollectionBySlug);

// GET /collections/:id - get specific collection by id
router.get("/:id", collectionController.getCollectionById);

// GET /collections/:id/edit - get collection edit page
router.get("/:id/edit", ensureAuth, collectionController.getEditCollection);

// POST /collections/:id/edit - update collection and redirect
router.post("/:id/edit", ensureAuth, collectionController.postEditCollection);

// GET /collections/:id/delete - delete collection and redirect
router.get("/:id/delete", ensureAuth, collectionController.deleteCollection);

module.exports = router;

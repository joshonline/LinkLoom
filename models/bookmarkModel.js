const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    faviconUrl: {
      type: String,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection",
      },
    ],

    isPublic: {
      type: Boolean,
      default: false,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed, // Any structure
      default: {},
    },

    relatedBookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookmark",
      },
    ],
  },
  { timestamps: true }
);

bookmarkSchema.index({ user: 1, url: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);

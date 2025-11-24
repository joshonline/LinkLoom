const mongoose = require("mongoose");
const { Schema } = mongoose;

const collectionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bookmark",
      },
    ],

    isPublic: {
      type: Boolean,
      default: false,
    },

    slug: {
      type: String,
      unique: false,
      trim: true,
    },

    color: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Regex-based slug auto-generation
collectionSchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

//Collection uniqueness
collectionSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Collection", collectionSchema);

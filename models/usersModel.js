const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    displayName: {
      type: String,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    showNameOnPublicCollections: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//default displayname
userSchema.pre("save", function (next) {
  if (!this.displayName) {
    this.displayName = this.username;
  }
  next();
});

userSchema.methods.setPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);
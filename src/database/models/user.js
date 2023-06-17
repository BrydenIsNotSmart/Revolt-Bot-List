const mongoose = require("mongoose");

let app = mongoose.Schema({
  revoltId: {
    type: String,
    required: true,
  },
  verified: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  isStaff: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  badges: {
    type: Array,
    default: [],
  },
  premium: {
    type: Boolean,
    default: false,
  },
  website: {
    type: String,
    required: false,
  },
  github: {
    type: String,
    required: false,
  },
  twitter: {
    type: String,
    required: false,
  },
  bio: {
    type: String,
    default: "This user does not have a bio.",
  },
  description: {
    type: String,
    default: "This user does not have a description.",
  },
});

module.exports = mongoose.model("users", app);

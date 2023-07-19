const mongoose = require("mongoose");

let app = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  owners: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  iconURL: {
    type: String,
    required: true
  },
  bannerURL: {
    type: String,
    required: false
  },
  shortDesc: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  submittedOn: {
    type: Date,
    required: false,
  },
  invite: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: true
  },
});

module.exports = mongoose.model("servers", app);

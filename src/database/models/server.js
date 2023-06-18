const mongoose = require("mongoose");

let app = mongoose.Schema({
  id: {
    type: String,
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
  tags: {
    type: Array,
    required: true
  },


});

module.exports = mongoose.model("servers", app);

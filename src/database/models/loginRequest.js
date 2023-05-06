const mongoose = require("mongoose");

let app = mongoose.Schema({
  revoltId: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  code: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("loginRequests", app);

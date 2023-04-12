const mongoose = require("mongoose");

let app = mongoose.Schema({
  revoltId: {
    type: String,
    required: true
  },
  verified: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true 
  },
  isStaff: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("users", app);
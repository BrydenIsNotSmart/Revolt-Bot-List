const mongoose = require("mongoose");

let app = mongoose.Schema({
  owner: { type: String },
  time: { type: Number },
  now: { type: Number },
  message: { type: String },
  channel: { type: String },
});

module.exports = mongoose.model("reminds", app);

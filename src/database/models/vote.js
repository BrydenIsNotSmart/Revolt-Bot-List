const mongoose = require("mongoose");

let app = mongoose.Schema({
  bot: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  ip: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("votes", app);

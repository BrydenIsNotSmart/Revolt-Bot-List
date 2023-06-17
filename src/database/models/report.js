const mongoose = require("mongoose");

let app = mongoose.Schema({
  reporterId: { type: String },
  type: { type: String }, // review, bot, server, user
  url: { type: String },
  active: { type: Boolean },
  botId: { type: String },
  userId: { type: String },
  serverId: { type: String },
  description: { type: String },
  reason: { type: String },
  notes: { type: String },
});

module.exports = mongoose.model("reports", app);

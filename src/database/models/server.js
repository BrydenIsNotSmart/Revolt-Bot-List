const mongoose = require("mongoose");

let app = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },

});

module.exports = mongoose.model("servers", app);

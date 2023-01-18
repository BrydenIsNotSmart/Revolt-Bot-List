const mongoose = require("mongoose");

let app = mongoose.Schema({

   prefix: {
    type: String,
    required: true
  },
  invite: {
    type: String,
    required: true
  },
  shortDesc: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  submittedOn: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    default: "awaiting" //- awaiting: waiting to be reviewed, appproved, denied, inprogress: currently being reviewed.
  },
  owners: {
    type: Array, 
    required: true
  },
  votes: {
    type: Number,
    default: 0,
  },
  tags: {
    type: Array,
    required: true
  }
});
module.exports = mongoose.model("bots", app);
const mongoose = require("mongoose");

let app = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  iconURL: {
    type: String,
    required: true,
  },
  bannerURL: {
    type: String,
    required: false,
  },
  prefix: {
    type: String,
    required: true,
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
  deniedOn: {
    type: Date,
    required: false,
  },
  approvedOn: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    default: "awaiting", //- awaiting: waiting to be reviewed, appproved, denied, inprogress: currently being reviewed.
  },
  certified: {
    type: Boolean,
    default: false,
  },
  certifyApplied: {
    type: Boolean,
    default: false,
  },
  owners: {
    type: Array,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
  monthlyVotes: {
    type: Number,
    default: 0,
  },
  servers: {
    type: Number,
    required: false,
  },
  library: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  reviews: {
    type: Array,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  support: {
    type: String,
    required: false,
  },
  github: {
    type: String,
    required: false,
  },
  apikey: {
    type: String,
    required: false
  },
  reviewer: {
    type: String,
    required: false
  },
  vanity: {
    type: String,
    required: false,
  },
  badges: {
    type: Array,
    default: [],
    required: false,
  },
});
module.exports = mongoose.model("bots", app);

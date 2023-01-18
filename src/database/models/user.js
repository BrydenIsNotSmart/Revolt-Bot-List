const mongoose = require("mongoose");
const bcrypt = require('bcrypt');


let app = mongoose.Schema({
  revoltId: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true 
  },
});

app.pre('save', function(next) {
    const userAccount = this;
    if (!userAccount.isModified('password')) {
      return next();
    }
    bcrypt.hash(userAccount.password, 10, (error, hash) => {
      if (error) {
        return next(error);
      }
      userAccount.password = hash;
      next();
    });
  });

module.exports = mongoose.model("users", app);
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }
  res.render("revurn/index.ejs", { user });
});

module.exports = router;

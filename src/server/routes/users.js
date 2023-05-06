const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send("Hello World");
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;

  let fetched_user = await userModel.findOne({ revoltId: id });
  if (fetched_user) {
    try {
      let userRaw = await client.users.fetch(fetched_user.revoltId);
      fetched_user.name = userRaw.username;
      fetched_user.avatar = userRaw.avatar;
    } catch (err) {
      res.send(err);
    }
  }

  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }
  res.render("user.ejs", { fetched_user, user });
});

module.exports = router;

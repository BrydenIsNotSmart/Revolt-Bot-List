const express = require("express");
const path = require("node:path");
const router = express.Router();
const model = global.botModel;
const userModel = global.userModel;

router.get("/", async (req, res) => {
  let bots = await model.find({
    status: "approved",
  });

  for (let i = 0; i < bots.length; i++) {
    bots[i].tags = bots[i].tags.join(", ");
  }

  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }
  res.render("index.ejs", {
    bots,
    user,
    config,
  });
});

router.get("/explore", async (req, res) => {
  let bots = await model.find({
    status: "approved",
  });

  for (let i = 0; i < bots.length; i++) {
    bots[i].tags = bots[i].tags.join(", ");
  }
  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }
  res.render("bexplore.ejs", {
    bots,
    user,
    config,
  });
});

router.get("/search", async (req, res) => {
  const search = req.query?.q || req.query?.s;
  if (!search) return res.redirect("/");

  let bots = await model.find({ approved: true });
  let botsList = [];
  let user =
    (await userModel.findOne({ revoltId: req.session.userAccountId })) || null;
  for (let i = 0; i < bots.length; i++) {
    const BotRaw =
      (await client.bots.fetchPublic(bots[i].id).catch(() => {})) || null;
    bots[i].name = BotRaw.username;
    bots[i].avatar = BotRaw.avatar;
    if (
      bots[i].tags.map((t) => t.toLowerCase()).includes(search.toLowerCase()) ||
      BotRaw.username.toLowerCase().includes(search.toLowerCase()) ||
      bots[i].shortDesc.toLowerCase().includes(search.toLowerCase()) ||
      bots[i].id.toLowerCase().includes(search.toLowerCase())
    ) {
      botsList.push(bots[i]);
    }
    bots[i].tags = bots[i].tags.join(", ");
  }
  console.log(search, botsList);
  res.render("search.ejs", {
    bot: global.client,
    bots: botsList,
    user,
    search,
  });
});

module.exports = router;

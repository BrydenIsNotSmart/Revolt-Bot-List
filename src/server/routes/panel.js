const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const Members = require("../../functions/members");
  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }
  const members = await Members(client, config.servers.main);
  res.render("panel/index.ejs", {
    bot: global.client ? global.client : null,
    path: req.path,
    botsdata: await botModel.find(),
    members,
    user,
    req,
  });
});

router.get("/bots", async (req, res) => {
  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }

  res.render("panel/bots.ejs", {
    bot: global.client ? global.client : null,
    path: req.path,
    botsdata: await botModel.find(),
    user,
    req,
  });
});

router.post("/bots/:id/testing", async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id });
  let client = global.client;

  if (bot.status === "approved") return res.status(400).json({ message: "This bot is already approved."});
  if (bot.status === "denied") return res.status(400).json({ message: "This bot is already denied."});
  if (bot.status === "inprogress") return res.status(400).json({ message: "This bot is already being tested."});

  if (!bot)
    return res.status(404).json({
      message: "This bot could not be found in our database.",
    });

  bot.status = "inprogress"
  bot.reviewer = req.session.userAccountId;
  await bot.save();

  selfBot.api.post(`/bots/${bot.id}/invite`, { 
    "server": config.servers.testing 
  })

  let server = client.servers.get(config.servers.testing);
   let createdChannel = await server.createChannel({
    name: `${bot.name.toLowerCase()}`,
    description: `Testing session channel to test ${bot.name}.`,
   });
console.log(createdChannel)
  let cat = [];
  server.categories.map(d => { if (d.id === "01GX1R43Q03JF7SMBKRW71F7EF") d.channels.push(createdChannel._id); cat.push(d) });
  server.edit({ categories: cat }); 
  await client.channels.get(createdChannel._id).sendMessage({
    content: `<@${req.session.userAccountId}>`,
    embeds: [
      { 
      colour: "#FF3366",
      description: `## Testing Session\nWelcome to your new testing session for <@${bot.id}>.\nYou may now begin testing this bot. Any questions? View the staff panel or ask an admin.\n\n### Prefix:\n\`${bot.prefix}\``
    }],
  });
  res.send("You may no begin to test this bot in our testing server.")
});

router.get("/bots/:id/approve", async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id });
  if (!bot || bot.deleted) return res.status(404).json({ message: "This bot could not be found on our list." });
  if (bot.status === "approved" || bot.status === "denied") return res.status(400).json({ message: "This bot has already been approved or denied." });

  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }
  res.render("panel/approve.ejs", {
    bot,
    user,
    req
  });
     
})

router.get("/bots/:id/deny", async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id });
  if (!bot || bot.deleted) return res.status(404).json({ message: "This bot was not found or it has been deleted" });
  if (bot.status === "approved" || bot.status === "denied") return res.status(400).json({ message: "This bot has already been approved or denied."});
  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }
  res.render('panel/deny.ejs', {
    bot,
    user,
    req
  });
});

router.post("/bots/:id/deny", async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id });
  if (!bot || bot.deleted) return res.status(404).json({ message: "This bot was not found or it has been deleted" });
  if (bot.status === "approved" || bot.status === "denied") return res.status(400).json({ message: "This bot has already been approved or denied."});
  bot.deniedOn = Date.now();

})

router.get("/grass", async (req,res) => {
  return res.status(200).json({message: "Touch some grass, kid."})
})

module.exports = router;

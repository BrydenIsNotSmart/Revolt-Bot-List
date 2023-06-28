const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
      let user = await userModel.findOne({ revoltId: req.session.userAccountId });
      if(user) {
        let userRaw = await ServerClient.users.fetch(user.revoltId);
        user.username = userRaw.username;
        user.avatar = userRaw.avatar;
      }
      res.render("servers/index.ejs", { user })
})

router.get("/submit", async (req, res) => {
  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if (user) {
    let userRaw = await ServerClient.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }
  res.render("servers/submit.ejs", {
    user,
    tags: config.tags.servers,
  });
});

router.post("/submit", async (req, res) => {
  const data = req.body;
  if (!data) return res.status(400).json("You need to provide the server's information.");
  let user = await userModel.findOne({ id: req.session.userAccountId });
  if (user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
  }
  if (await serverModel.findOne({ id: data.serverid })) return res.status(409).render("error.ejs", { user, code: 409, message: "This server has already been added to the list." })
  let serverRaw = await ServerClient.servers.fetch(data.serverid).catch((err) => { console.log(err) });
  if (!serverRaw) return res.status(400).render("error.ejs", {user, code: 400, message: "The provided server couldn't be found on Revolt" })
  if (data.owners) {
    let owners = [];
    owners.push(req.session.userAccountId);
    data.owners.split(" ").forEach((owner) => owners.push(owner));
    data.owners = owners;
  } else {
    data.owners = [];
    data.owners.push(req.session.userAccountId);
  }
  if (data.owners) {
    data.owners.forEach(async (owner) => {
      try {
        await ServerClient.users.get(owner);
      } catch (e) {
        return res.status(409).render(
          "error.ejs", {
          user,
          code: 409,
          message: "One of your owners is not a real user, or isn't in a server with the bot.",
        }
        )
      }
    });
  }  

  await serverModel.create({
      id: data.serverid,
      name: serverRaw.name,
      iconURL: `https://autumn.revolt.chat/icons/${serverRaw.icon}`,
      bannerURL: `https://autumn.revolt.chat/banners/${serverRaw.banner}`,
      prefix: data.prefix,
      shortDesc: data.shortDesc,
      description: data.desc,
      website: data.website || null,
      invite: data.invite || null,
      tags: data.tags,
      owners: data.owners,
      submittedOn: Date.now(),
    })
    .then(async () => {
      res.status(201).json({ message: "Added to queue", code: "OK" });
      let logs = ServerClient.channels.get(config.channels.weblogs);
      logs.sendMessage(
        `<@${req.session.userAccountId}> has submitted **${serverRaw.name}** to the list.\n<https://revoltbots.org/servers/${data.serverid}>`
      );
    });
});

module.exports = router;

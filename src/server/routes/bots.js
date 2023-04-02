const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    let model = require("../../database/models/bot.js")
    let bots = await model.find({
        status: "approved",
      });
    
      for (let i = 0; i < bots.length; i++) {
        const BotRaw = await client.users.get(bots[i]._id);
        bots[i].name = BotRaw.username;
        bots[i].avatar = BotRaw.avatar;
      }
      let userModel = require("../../database/models/user.js")
      let user = await userModel.findOne({ revoltId: req.session.userAccountId });
      if(user) {
        let userRaw = await client.users.fetch(user.revoltId);
        user.username = userRaw.username;
        user.avatar = userRaw.avatar;
      }
    res.render("index.ejs", {
        bots,
        user
    })
})

router.get('/submit', checkAuth, async (req, res) => {
  let userModel = require("../../database/models/user.js")
      let user = await userModel.findOne({ revoltId: req.session.userAccountId });
      if(user) {
        let userRaw = await client.users.fetch(user.revoltId);
        user.username = userRaw.username;
        user.avatar = userRaw.avatar;
      }
  res.render("bots/submit.ejs", {
    user,
    tags: config.tags
  }) 
})

router.post('/submit', checkAuth, async (req, res) => {
    const data = req.body;
    if (!data) return res.status(400).json("You need to provide the bot's information.")
    let model = require("../../database/models/bot.js")
    if (await model.findOne({ id: data.botid })) return res.status(409).json({ message: "This bot is already added."})
    let BotRaw = await client.users.fetch(data.botid).catch((err) => { console.log(err)})
    if (!BotRaw) return res.status(400).json({ message: "The provided bot couldn't be found on Revolt."})
    if (!BotRaw.bot) return res.status(400).json({ message: "The provided bot is not a bot account, instead a human account."})

    if (data.owners) {
      let owners = []
      owners.push(req.session.userAccountId)
    
      data.owners.split(" ").forEach(owner => {
      owners.push(owner)
    })
    data.owners = owners;
  } else {
     data.owners = [];
     data.owners.push(req.session.userAccountId)
   }
  if (data.owners) {
      data.owners.forEach(async owner => {
        try {
          await client.users.fetch(owner);
        } catch (e) {
          return res.status(409).json({ message: "One of your owners is not a real user." });
        }
      });
  }

    const bot = await model.create({
      id: data.botid,
      prefix: data.prefix,
      shortDesc: data.shortDesc,
      description: data.desc,
      website: data.website || null,
      github: data.github || null,
      support: data.support || null,
      library: data.library,
      tags: data.tags,
      owners: data.owners,
      submittedOn: Date.now()
    })
    .then(async () => {
      res.status(201).json({ message: "Added to queue", code: "OK" });
      let logs = client.channels.get(config.channels.weblogs);
      logs.sendMessage(
        `<@${req.session.userAccountId}> has submitted **${BotRaw.username}** to the list.\nhttps://revoltbots.org/bot/${BotRaw._id.toLowercase()}`
      );
    });
})

router.get("/:id", async (req, res) => {
    let model = require("../../database/models/bot")
    let bot = await model.findOne({ id: req.params.id});
    if (!bot) return res.status(404).json({ message: "This bot could not be found on our list."})
    let BotRaw = (await client.users.fetch(bot.id)) || null;
    if (!BotRaw) return res.status(404).json({ message: "This bot could not be found on Discord."})
    bot.name = BotRaw.username;
    bot.avatar = BotRaw.avatar;

    res.json(bot)
})

function checkAuth(req, res, next) {
    if (req.session.userAccountId) {
        let model = require("../../database/models/user.js")
        model.findOne({ revoltId: req.session.userAccountId }, (error, userAccount) => {
        if (error) {
          res.status(500).send(error);
        } else if (userAccount) {
          next();
        } else {
          res.redirect("/login")
        }
      });
    } else {
      res.redirect("/login")
    }
  }

module.exports = router;
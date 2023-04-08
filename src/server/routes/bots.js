const express = require('express');
const ms = require("ms")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const router = express.Router();

router.get('/', async (req, res) => {
    let bots = await botModel.find({
        status: "approved",
      });
    
      for (let i = 0; i < bots.length; i++) {
        const BotRaw = await client.bots.fetchPublic(bots[i].id);
        bots[i].name = BotRaw.username;
        bots[i].avatar = BotRaw.avatar;
      }
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
    if (await botModel.findOne({ id: data.botid })) return res.status(409).json({ message: "This bot is already added."})
    let BotRaw = await client.bots.fetchPublic(data.botid).catch((err) => { console.log(err) });
    if (!BotRaw) return res.status(400).json({ message: "The provided bot couldn't be found on Revolt OR it's a private bot, make it public to add it."})

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
          await client.users.get(owner);
        } catch (e) {
          return res.status(409).json({ message: "One of your owners is not a real user, or isn't in our server." });
        }
      });
  }

    const bot = await botModel.create({
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
        `<@${req.session.userAccountId}> has submitted **${BotRaw.username}** to the list.\nhttps://revoltbots.org/bot/${data.botid}`
      );
    });
})

router.get("/:id", async (req, res) => {
    let bot = await botModel.findOne({ id: req.params.id});
    if (!bot) return res.status(404).json({ message: "This bot could not be found on our list."})
    let BotRaw = (await client.bots.fetchPublic(bot.id)) || null;
    if (!BotRaw) return res.status(404).json({ message: "This bot could not be found on Revolt."})
    const marked = require("marked");
    const description = marked.parse(bot.description);
    bot.name = BotRaw.username;
    bot.avatar = BotRaw.avatar;
    bot.tags = bot.tags.join(", ")
    bot.description = description;
    let user = await userModel.findOne({ revoltId: req.session.userAccountId });
    if(user) {
      let userRaw = await client.users.fetch(user.revoltId);
      user.username = userRaw.username;
      user.avatar = userRaw.avatar;
      user.id = user.revoltId
    }

    res.render("bots/view.ejs", {
      user: user || null,
      botclient: client,
      bot
    })
})

router.get("/:id/edit", checkAuth, async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id});
  if (!bot) return res.status(404).json({ message: "This bot could not be found on our list."})
  if (!bot.owners.includes(req.session.userAccountId)) return res.redirect("/");
  let BotRaw = (await client.bots.fetchPublic(bot.id)) || null;
  if (!BotRaw) return res.status(404).json({ message: "This bot could not be found on Revolt."})
  bot.name = BotRaw.username;
  bot.avatar = BotRaw.avatar;
  let user = await userModel.findOne({ revoltId: req.session.userAccountId });

  if(user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
    user.id = user.revoltId
  }

  res.render("bots/edit.ejs", {
    user: user || null,
    botclient: client,
    tags: config.tags,
    bot
  })
})

router.post('/:id/edit', checkAuth, async (req, res) => {
  const data = req.body;
  if (!data) return res.status(400).json("You need to provide the bot's information.")
  let bot = await botModel.findOne({ id: req.params.id});
  if (!bot) return res.status(404).json({ message: "This bot could not be found on our list."})
  if (!bot.owners.includes(req.session.userAccountId)) return res.redirect("/")
  let BotRaw = await client.bots.fetchPublic(req.params.id).catch((err) => { console.log(err) });
  if (!BotRaw) return res.status(400).json({ message: "The provided bot couldn't be found on Revolt OR it's a private bot, make it public to add it."})

  if (data.owners) {
    let owners = []
    owners.push(req.session.userAccountId)
  
    data.owners.split(" ").forEach(owner => {
    owners.push(owner)
  })
  data.owners = owners;
} 

if (data.owners) {
    data.owners.forEach(async owner => {
      try {
        await client.users.get(owner);
      } catch (e) {
        return res.status(409).json({ message: "One of your owners is not a real user, or isn't in our server." });
      }
    });
}

bot.prefix = data.prefix;
bot.website = data.website;
bot.github = data.github;
bot.description = data.desc;
bot.shortDesc = data.shortDesc;
bot.support = data.support || null;
bot.libary = data.libary;
bot.tags = data.tags;
if (data.owners) bot.owners = data.owners;
await bot.save().then(async () => {
    res.status(201).json({ message: "Successfully Edited", code: "OK" });
    let logs = client.channels.get(config.channels.weblogs);
    logs.sendMessage(
      `<@${req.session.userAccountId}> edited **${BotRaw.username}**.\nhttps://revoltbots.org/bots/${req.params.id}`
    );
  });
})

router.get("/:id/vote", async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id});
  if (!bot) return res.status(404).json({ message: "This bot could not be found on our list."})
  let BotRaw = (await client.bots.fetchPublic(bot.id)) || null;
  if (!BotRaw) return res.status(404).json({ message: "This bot could not be found on Revolt."})
  bot.name = BotRaw.username;
  bot.avatar = BotRaw.avatar;
  let user = await userModel.findOne({ revoltId: req.session.userAccountId });
  if(user) {
    let userRaw = await client.users.fetch(user.revoltId);
    user.username = userRaw.username;
    user.avatar = userRaw.avatar;
    user.id = user.revoltId
  }

  res.render("bots/vote.ejs", {
    user: user || null,
    bot
  })
})

router.post("/:id/vote", async (req, res) => {
  let bot = await botModel.findOne({ id: req.params.id });
  if (!bot)
    return res
      .status(404)
      .json({ message: "This bot was not found on our list." });
  let x = await voteModel.findOne({
    user: req.session.userAccountId,
    bot: req.params.id,
  });
  if (x) {
    const vote = canUserVote(x);
    if (!vote.status)
      return res.status(400).send(
        `Please wait ${vote.formatted} before you can vote again.`
      );
    await x.remove().catch(() => null);
  }

  const D = Date.now(),
    time = 43200000;
  await voteModel.create({
    bot: req.params.id,
    user: req.session.userAccountId,
    date: D,
    time,
  });
  await botModel.findOneAndUpdate(
    { id: req.params.id },
    { $inc: { votes: 1 } }
  );
  const BotRaw = await client.users.fetch(bot.id)

  const logs = client.channels.get(config.channels.votelogs);
  if (logs) logs.sendMessage(`<@${req.session.userAccountId}> voted for **${BotRaw.username}**.\nhttps://revoltbots.org/bots/${BotRaw._id}`).catch(() => null);

  return res.redirect(
    `/bots/${req.params.id}?success=true&body=You voted successfully. You can vote again after 12 hours.`
  );
})

function checkAuth(req, res, next) {
    if (req.session.userAccountId) {
      userModel.findOne({ revoltId: req.session.userAccountId }, (error, userAccount) => {
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

function canUserVote(x) {
  const left = x.time - (Date.now() - x.date),
    formatted = ms(left, { long: true });
  if (left <= 0 || formatted.includes("-")) return { status: true };
  return { status: false, left, formatted };
}
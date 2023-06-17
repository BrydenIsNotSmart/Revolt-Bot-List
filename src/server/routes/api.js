const express = require("express");
const router = express.Router();
const ms = require("ms");

router.get("/", (req, res) => res.redirect("/api/v1"));

router.get("/v1", async (req, res) => {
  res.send("Hello World");
});

router.get("/v1/bots/:id", async (req, res) => {
  let model = require("../../database/models/bot");
  const rs = await model.findOne({ id: req.params.id });
  if (!rs)
    return res
      .status(404)
      .json({ message: "This bot was not found on our list." });
  if (!rs.status === "approved")
    return res.status(404).json({ message: "This bot is not approved yet." });
  return res.json(await getBotData(rs, true, req));
});

router.post("/v1/bots/stats", async (req, res) => {
  const key = req.headers.authorization;
  if (!key) return res.status(401).json({ json: "Please provides a API Key." });

  let bot = await botModel.findOne({ apikey: key });
  if (!bot)
    return res.status(404).json({
      message:
        "This bot is not on our list, or you entered an invaild API Key.",
    });

  const servers = req.body.server_count || req.header("server_count");

  if (!servers)
    return res.status(400).json({ message: "Please provide a server count." });

  bot.servers = servers;
  console.log(servers)
  await bot.save().catch(() => null);
  return res.json({ message: "Successfully updated." });
});

router.get("/v1/bots/:id/voted", async (req, res) => {
  const bot = await global.botModel.findOne({ id: req.params.id });
  if (!bot)
    return res.status(404).json({ message: "This bot is not on our list." });
  if (!bot.status === "approved")
    return res.status(400).json({ message: "This bot is not approved yet." });

  const id = req.query.user;
  if (!id)
    return res
      .status(400)
      .json({ message: `You didn't provide 'user' in the query` });
  let user = await global.client.users.fetch(id).catch(() => null);
  if (!user)
    return res.status(400).json({
      message: `The 'user' you provided couldn't be found on Revolt.\n Please use the /votes endpoint`,
    });
  if (user.bot)
    return res.status(400).json({
      message: `The user ID you provided is a Revolt bot, and bots can't vote.\n Please use the /votes endpoint`,
    });

  let x = await global.voteModel.findOne({ bot: bot.id, user: user._id });
  if (!x) return res.json({ voted: false });
  const vote = canUserVote(x);
  if (!vote.status) return res.json({ voted: false });
  return res.json({
    voted: true,
    message: "Please use the /votes endpoint",
  });
});

router.get("/v1/bots/:id/votes", async (req, res) => {
  const bot = await global.botModel.findOne({ id: req.params.id });
  if (!bot)
    return res.status(404).json({ message: "This bot is not on our list." });
  if (!bot.status === "approved")
    return res.status(400).json({ message: "This bot is not approved yet." });
  const id = req.query.user;
  if (id) {
    let user = await global.sclient.users.fetch(id).catch(() => null);
    if (!user)
      return res.status(400).json({
        message: `The 'user' you provided couldn't be found on Revolt.`,
      });
    if (user.bot)
      return res.status(400).json({
        message: `The user ID you provided is a Revolt bot, and bots can't vote.`,
      });

    let userX = await global.voteModel.findOne({ bot: bot.id, user: user._id });
    if (!userX) return res.json({ voted: false });
    const vote = canUserVote(userX);
    if (!vote.status) return res.json({ voted: false });
    if (vote.status) {
      return res.json({
        voted: true,
        current: parseInt(userX.date),
        next: parseInt(userX.date) + parseInt(userX.time),
      });
    }
  }
  let botX = await global.voteModel.find({ bot: bot.id });
  if (!botX || !botX.length)
    return res.json({
      status: false,
      message: `There is 0 users waiting to vote for your bot.`,
    });
  return res.json({
    votes: botX.map((c) => ({
      user: c.user,
      current: parseInt(c.date),
      next: parseInt(c.date) + parseInt(c.time),
    })),
  });
});

module.exports = router;

async function getBotData(data, fetchReviews = false, req) {
  const BotRaw = await client.bots.fetchPublic(data.id).catch(() => {});
  const info = {
    // This doesn't need to be in another object (i.e: 'final_data')
    id: data.id,
    username: data.name,
    avatar: data.iconURL,
    prefix: data.prefix,
    owners: data.owners,
    tags: data.tags,
    submittedOn: data.submittedOn,
    shortDescription: data.shortDesc,
    description: data.description,
    library: data.library,

    // Counts
    servers: +data.servers || "N/A",
    totalVotes: data.votes,
    monthlyVotes: data.monthlyVotes,

    // Links
    invite: `https://app.revolt.chat/bot/${data.id}`,
    website: data.website,
    github: data.github,
    support: data.support,
  };

  if (BotRaw) {
    info.username = BotRaw.username;
    info.avatar = `https://autumn.revolt.chat/avatars/${BotRaw.avatar._id}/${BotRaw.avatar.filename}.webp`;
  }
  return info;
}

function canUserVote(x) {
  const left = x.time - (Date.now() - x.date),
    formatted = ms(left, { long: true });
  if (left >= 0 || formatted.includes("-")) return { status: true };
  return { status: false, left, formatted };
}

const express = require("express");
const router = express.Router();

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

  bot.servers = servers.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  await bot.save().catch(() => null);
  return res.json({ message: "Successfully updated." });
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

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

    res.render("index.ejs", {
        bots
    })
})

module.exports = router;
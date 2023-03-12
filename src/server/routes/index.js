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
        user,
    })
})

module.exports = router;
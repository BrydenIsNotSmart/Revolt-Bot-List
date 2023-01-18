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

router.get('/bots/submit', checkAuth, async (req, res) => res.render("bots/submit.ejs"))

router.post('/bots/submit', checkAuth, async (req, res) => {
    const data = req.body;
    if (!data) return res.status(400).json("You need to provide the bot's information.")
    let model = require("../../database/models/bot.js")
    if (await model.findOne({ _id: data.id })) return res.status(409).json({ message: "This bot is already added."})


})

function checkAuth(req, res, next) {
    if (req.session.userAccountId) {
        let model = require("../database/models/user.js")
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
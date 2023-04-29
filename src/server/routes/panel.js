const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
   const Members = require("../../functions/members");
   let user = await userModel.findOne({ revoltId: req.session.userAccountId });
      if(user) {
        let userRaw = await client.users.fetch(user.revoltId);
        user.username = userRaw.username;
        user.avatar = userRaw.avatar;
      }
   const members = await Members(client, config.servers.main)
   res.render("panel/index.ejs", {
      bot: global.client ? global.client : null,
      path: req.path,
      botsdata: await botModel.find(),
      members,
      user, 
      req
   })
   
})

router.get('/bots', async (req, res) => {

   let user = await userModel.findOne({ revoltId: req.session.userAccountId });
      if(user) {
        let userRaw = await client.users.fetch(user.revoltId);
        user.username = userRaw.username;
        user.avatar = userRaw.avatar;
      }

   res.render("panel/bots.ejs", {
      bot: global.client ? global.client : null,
      path: req.path,
      botsdata: await botModel.find(),
      user, 
      req
   })
   
})

module.exports = router;
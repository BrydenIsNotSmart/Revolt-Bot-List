const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
   res.send("Hello World")
})

router.get('/:id', async (req, res) => {
   let id = req.params.id;

   let user = await userModel.findOne({ revoltId: id });
      if (user) {
         try {
        let userRaw = await client.users.fetch(user.revoltId);
        user.username = userRaw.username;
        user.avatar = userRaw.avatar;
         } catch(err) {
           res.send(err)
         }
      }
       
      res.json(user)
})

module.exports = router;
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
   res.render("panel/index.ejs")
})

module.exports = router;
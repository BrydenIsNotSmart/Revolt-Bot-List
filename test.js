const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const config = require("./config");

 fetchBot("01GQ15T55EJHGSS91FBT1YFHZW")

 async function fetchBot(id) {
    const response = await fetch(`https://api.revolt.chat/bots/${id}/invite`, {
        method: 'get',
        Headers: {'x-session-token': config.bot.token}
    })
    const data = await response.json();
    console.log(data)

 }
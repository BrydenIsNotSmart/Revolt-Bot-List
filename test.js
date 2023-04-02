const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const config = require("./config");

 fetchBot("01GQ3NS0EB3FF8V2Q6KHX887DS")

 async function fetchBot(id) {
    const response = await fetch(`https://api.revolt.chat/users/${id}`, {
        method: 'get',
        Headers: {'x-session-token': config.bot.token}
    })
    const data = await response.json();
    console.log(data)

 }
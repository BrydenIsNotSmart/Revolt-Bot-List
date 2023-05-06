const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const config = require("./config");

fetchBot("01GPZ5PTPQ2RNMZEF02NKD7TQE");

async function fetchBot(id) {
  const response = await fetch(`https://api.revolt.chat/users/${id}`, {
    method: "get",
    Headers: { "x-session-token": config.bot.token },
  });
  const data = await response.json();
  console.log(data);
}

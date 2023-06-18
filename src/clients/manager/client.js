const { Client } = require("revolt.js");
const { Collection } = require("discord.js");
const { readdirSync } = require("node:fs");
const { join } = require("node:path");
const Reminders = require("../../database/models/reminds");
const client = new Client();
const selfBot = new Client();
const fs = require("node:fs");
const path = require("node:path");
client.remind = new Map();
global.client = client;
global.selfBot = selfBot;

//-Events-//
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  client.on(event.name, (...args) => event.execute(...args, client));
}

//-Commands-//
client.commands = new Collection();
client.aliases = new Collection();
const getFiles = (path) =>
  readdirSync(join(__dirname, path)).filter((file) => file.endsWith(".js"));
for (const cfile of getFiles("commands")) {
  const command = require(join(__dirname, "commands", `${cfile}`));
  client.commands.set(command.name, command);
  if (command.aliases)
    command.aliases.forEach((alias) => client.aliases.set(alias, command.name));
}

selfBot.on("ready", () => {
  console.log(`[INFO] Logged in as ${selfBot.user.username}`);
  selfBot.users.edit({
    status: {
      presence: "Focus",
      text: "Inviting bots to the server..",
    },
  });
});

client.once("ready", () => {
  setInterval(async () => {
    let reminds = await Reminders.find();
    reminds.map(async (db) => {
      let set = db.now;
      let timeout = db.time;
      if (set - (Date.now() - timeout) <= 0) {
        await client.api
          .post(`/channels/${db.channel}/messages`, {
            content: `<@${db.owner}>, reminder to vote for <@${db.message}>`,
          })
          .catch(() => {});
        return await db.delete();
      }
    });
  }, 6000);
});

client.loginBot(config.clients.manager.token);
//selfBot.login({
 // email: config.selfbot.email,
  //password: config.selfbot.password,
//});
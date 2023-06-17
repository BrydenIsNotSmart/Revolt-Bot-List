module.exports = {
  name: "ping",
  aliases: ["latency", "delay"],
  category: "Info",
  description: "Check the bots ping. (Delay)",
  async run(client, message, args) {
    try {
      message.channel.startTyping();
      const mesg = await message.reply(":ping_pong: Pong!");
      message.channel.stopTyping();
      await mesg.edit({
        content: " ",
        embeds: [
          {
            colour: "#ff4654",
            description: `### :ping_pong: Ping Pong\nBot Latency: \`${
              mesg.createdAt - message.createdAt
            }ms\`\n Websocket Latency: \`${client.websocket.ping}ms\``,
          },
        ],
      });
    } catch (err) {
      console.error(err);
      message.channel.stopTyping();
      await message.reply({
        embeds: [
          {
            description: `:x: There was an error while executing this command! \n\`\`\`js\n${err}\`\`\``,
            colour: "#ff4654",
          },
        ],
      });
    }
  },
};

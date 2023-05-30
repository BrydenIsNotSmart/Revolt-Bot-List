module.exports = {
  name: "message",
  async execute(message) {
    if (message.author.bot || !message.content) return;
    if (!message.content.toLowerCase().startsWith(config.clients.manager.prefix)) return;
    let args = message.content.split(" ");
    let command = args.shift().slice(config.clients.manager.prefix.length).toLowerCase();
    let cmd =
      client.commands.get(command) ||
      client.commands.get(client.aliases.get(command));
    if (!cmd) return;
    try {
      if (message.channel.havePermission("SendMessage")) {
        await cmd.run(client, message, args);
      } else return;
    } catch (error) {
      console.error(error);
      await message.reply({
        embeds: [
          {
            description: `:x: There was an error while executing this command! \n\`\`\`js\n${error}\`\`\``,
            colour: "#39C6F1",
          },
        ],
      });
    }
  },
};

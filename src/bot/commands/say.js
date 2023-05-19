module.exports = {
    name: "say",
    aliases: ["repeat", "relay"],
    category: "Uttilty",
    description: "Repeat back a given message.",
    async run(client, message, args) {
      try {
        message.channel.startTyping();
        if (!args[0]) return message.reply({ content: "Please provide me with something to say!"}, false);

        await message.channel.sendMessage(args.join(" "));
        
        message.channel.stopTyping();
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
  
let model = require("../../../database/models/loginRequest");

module.exports = {
  name: "login",
  aliases: ["approveRequest"],
  category: "Login System",
  description: "Confirm a login to the website.",
  async run(client, message, args) {
    try {
      if (!args[0]) return message.reply(`:x: Please provide a login code!`);
      let request = await model.findOne({ verified: false, code: args[0] });
      if (!request) return message.reply(`:x: Invaild login code!`);

      if (message.author_id === request.revoltId) {
        (request.verified = true), await request.save();
        return message.reply(
          `:white_check_mark: I have successfully confirmed your login request.\nIf you were told to do this by someone else, contact support right now!`
        );
      } else {
        return message.reply(
          `:x: You are not on the same account that is trying to login.`
        );
      }
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

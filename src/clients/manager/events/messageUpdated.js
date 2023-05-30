const Reminder = require("../../../database/models/reminds");
const regex = new RegExp(`<@(.*)>`);
module.exports = {
  name: "message/updated",
  async execute(message, nmsg) {
    if (
      nmsg.emoji_id === "🔔" &&
      client.remind.get(message._id) &&
      client.remind.get(message._id).owner === nmsg.user_id
    ) {
      client.remind.delete(message._id);
      let mention = client.messages.get(message._id).content.match(regex);
      await new Reminder({
        owner: nmsg.user_id,
        time: 43200000,
        now: Date.now(),
        message: mention[1],
        channel: nmsg.channel_id,
      }).save();

      return message.reply(
        `<@${nmsg.user_id}>, I will remind you in 12 hours to vote for <@${mention[1]}>`
      );
    }
  },
};

const ms = require("ms");
const reactions = ["🔔"];
module.exports = {
  name: "vote",
  aliases: ["votebot", "v"],
  category: "BotList",
  description: "Vote for a bot on the BotList.",
  async run(client, message, args) {
    try {
      let botModel = require("../../../database/models/bot");
      let voteModel = require("../../../database/models/vote");

      let BotRaw;
      if (new RegExp(`(<@!?(.*)>)`).test(args[0])) {
        BotRaw = await client.users.fetch(
          args[0].match(new RegExp(`(<@!?(.*)>)`))[2]
        );
      } else {
        BotRaw = await client.users.fetch(args[0]).catch(() => {
          BotRaw = false;
        });
      }
      if (!BotRaw || !BotRaw.bot)
        return message.reply("This is not a real bot. :hmm:");

      let bot = await botModel.findOne({ id: BotRaw._id });
      if (!bot) return message.reply("This bot was not found on our list.");

      let x = await voteModel.findOne({
        user: message.author._id,
        bot: BotRaw._id,
      });

      if (x) {
        const vote = canUserVote(x);
        if (!vote.status)
          return message.reply(
            `Please wait ${vote.formatted} before you can vote again.`
          );
        await x.remove().catch(() => null);
      }

      const D = Date.now(),
        time = 43200000;
      await voteModel.create({
        bot: BotRaw._id,
        user: message.author._id,
        date: D,
        time,
      });
      await botModel.findOneAndUpdate(
        { id: BotRaw._id },
        { $inc: { votes: 1, monthlyVotes: 1 } }
      );

      const logs = client.channels.get(config.channels.votelogs);

      logs
        .sendMessage(
          `<\\@${message.author._id}> voted for **${BotRaw.username}**.\n<https://revoltbots.org/bots/${bot.vanity || BotRaw._id}>`
        )
        .catch(() => null);

      await message
        .reply({
          content: `You have successfully voted for <@${BotRaw._id}>.`,
          interactions: [reactions],
        })
        .then((msg) => {
          client.remind.set(msg._id, { owner: message.author._id });

          setTimeout(() => {
            if (!client.remind.get(msg._id)) return;
            client.remind.delete(msg._id);
            msg.edit({
              content: `You have successfully voted for <@${BotRaw._id}>. (Reaction timed out)`,
            });
          }, 30000);
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

function canUserVote(x) {
  const left = x.time - (Date.now() - x.date),
    formatted = ms(left, { long: true });
  if (left <= 0 || formatted.includes("-")) return { status: true };
  return { status: false, left, formatted };
}

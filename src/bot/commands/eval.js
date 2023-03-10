const { getCode, clean } = require("@elara-services/eval-helper");

module.exports = {
    name: "eval",
    category: "Dev",
    description: "Evaluates Javascript code in a command.",
    async run(client, message, args) {
        if (!config.ownerids.includes(message.author._id)) return message.reply(":x: This is an owner only command.");
        if (!args[0]) return message.reply({ embeds: [
            {
                colour: "Red",
                description: ":x: You must provide code to evaluate."
            }
        ] });
        try {
            const evaled = await getCode({ code: args.join(" ") });
            const code = await clean(eval(evaled), [ client.session ]);

        return message.reply({ embeds: [
            {
                colour: "Green",
                description: `**Input**\n\`\`\`${args.join(" ")}\`\`\`\n\n**Output**\n\`\`\`js\n${code}\n\`\`\``
            }
        ] });
        } catch (e) {

        return message.reply({ embeds: [
            {
                colour: "Red",
                description: `:x: There was an error during evaluation.\n\`\`\`js\n${e.stack}\`\`\``
            }
        ] })
        }
    },
};

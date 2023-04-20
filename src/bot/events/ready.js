const model = require('../../database/models/loginRequest');

module.exports = {
	name: "ready",
	async execute(client) {
		console.info(`[INFO] ${client.user.username} is logged in and ready.`)
		client.users.edit({
			status: {
			  text: "Watching de botlist",
			  presence: "Focus",
			},
		});

		setInterval(async () => {
		let requests = await model.find();
		requests.forEach((r) => {
           r.delete();
		})
		}, 1800000)

		//-Updating Bot Info-//
		setInterval(async () => {
		let bots = await botModel.find();
		bots.forEach(async (bot) => {
			setTimeout(async () => {
             let BotRaw = await client.bots.fetchPublic(bot.id);

			 bot.name = BotRaw.username
			 bot.iconURL = `https://autumn.revolt.chat/avatars/${BotRaw.avatar._id}/${BotRaw.avatar.filename}`
			 await bot.save();
			}, 10000)
		  })
	    }, 86400000)

	},
};

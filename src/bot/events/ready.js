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

		//-Vote Reset-//
		let CronJob = require('cron').CronJob;
        let voteReset = new CronJob(
        '0 0 1 * *',
         async function() {
			let bots = await botModel.find();
            let month = { 0: "January", 1: "February", 2: "March", 3: "April", 4: "May", 5: "June", 6: "July", 7: "August", 8: "September", 9: "October", 10: "November", 11: "December" };
            bots.sort((a, b) => b.monthlyVotes - a.monthlyVotes);
            let top5 = bots.slice(0, 5); // get the top 5 bots
            let content = `# Vote Reset\nThe monthly vote count has been reset!\n Congratulations to the following bots for being the **Most Voted Bots of __${month[new Date().getMonth()]}__**.\n\n\n## ${month[new Date().getMonth()]} Leaderboard\n`;
            top5.forEach((bot, index) => {
            content += `${index + 1}. ${bot.name} - ${bot.monthlyVotes} monthly votes, ${bot.votes} votes in total\n`;
            });
            await client.api.post(`/channels/01GQ15314DTQ68KXXG942648WG/messages`, {
            content
            }).catch(() => { });
		     	  await bots.forEach(async (a) => {
			      await botModel.findOneAndUpdate(
				    {
					  id: a.id,
				    },
				    {
					  $set: {
						monthlyVotes: 0,
					  },
				    }
				  );
			    });
             },
           null,
           true,
          'America/Los_Angeles'
        );
		voteReset.start()
	},
};
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
			let bots = await voteModel.find();
            let month = { 0: "December", 1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June", 7: "July", 8: "August", 9: "September", 10: "October", 11: "November" };
            let top5 = bots.sort((a, b) => b.monthlyVotes - a.monthlyVotes).slice(0,5);
			let description =  `# Vote Reset\nThe monthly vote count has been reset!\nCongratulations to the following bots for being the **Most Voted Bots of __${month[new Date().getMonth()+1]}__**.\n\n\n## ${month[new Date().getMonth()+1]} Leaderboard!`

            top5.forEach((bot, index) => {
            description += `\n${index + 1}. ${bot.name} - ${bot.monthlyVotes} monthly votes, ${bot.votes} votes in total\n`;
            });
			let embeds = [{
				colour: "#ff4654",
				description
			}]
            await client.api.post(`/channels/01GQ15314DTQ68KXXG942648WG/messages`, {
            embeds
            }).catch(() => { });
			      let voteModel = require("../../database/models/vote")
				  await voteModel.collection.drop();
		     	  bots.forEach(async (a) => {
				 await voteModel.findOneAndUpdate(
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
          'America/New_York'
        );
		voteReset.start()
	},
};
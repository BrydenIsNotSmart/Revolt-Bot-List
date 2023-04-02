require('dotenv').config();

module.exports = {
    port: 80,
      mongoURI: process.env.mongoURI,
        sessionSecret: process.env.sessionSecret,
         ownerids: ["01GPZ5PTPQ2RNMZEF02NKD7TQE"],
           bot: {
             prefix: "rbl!",
             token: process.env.botToken
           },
             selfbot: {
              email: process.env.selfBotEmail,
              password: process.env.selfBotPassword
             },
                tags: ["Bridge", "Multipurpose", "Moderation", "Giveaways", "Music", "Fun", "Chatbot", "Polls", "Counting"],
                 channels: {
                 weblogs: "01GQ1AKANW8TVTH6R2P79069K8"
              }
}
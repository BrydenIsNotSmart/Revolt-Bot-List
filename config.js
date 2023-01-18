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
              tags: ["Fun"]
}
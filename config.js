require("dotenv").config();

module.exports = {
  port: 8082,
  mongoURI: process.env.mongoURI,
  sessionSecret: process.env.sessionSecret,
  ownerids: ["01GPZ5PTPQ2RNMZEF02NKD7TQE", "01GQ3NS0EB3FF8V2Q6KHX887DS"],
  bot: {
    prefix: "rbl!",
    token: process.env.botToken,
  },
  selfbot: {
    email: process.env.selfBotEmail,
    password: process.env.selfBotPassword,
  },
  tags: [
    "Bridge",
    "Multipurpose",
    "Moderation",
    "Giveaways",
    "Music",
    "Fun",
    "Chatbot",
    "Polls",
    "Counting",
    "Logging",
    "Game",
    "NSFW",
  ],
  channels: {
    weblogs: "01GQ1AKANW8TVTH6R2P79069K8",
    votelogs: "01GXCM24QX3WZP1GBNFQEHSHME",
  },
  servers: {
    main: "01GQ14WC58C8AXCWNJQBFDZNT3",
    testing: "01GX1QRSHEA8NE8WCGHEPN3S19",
  },
  roles: {
    bots: "01GX2QPE8SWZWPVN3DFQGJCMHC",
    members: "01GVC849ZNZYCC9BFYHNJSNNBB",
  },
};

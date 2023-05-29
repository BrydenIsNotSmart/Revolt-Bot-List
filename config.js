require("dotenv").config();

module.exports = {
  port: 80,
  mongoURI:  process.env.mongoURI,
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
    weblogs: "01H17DM6GQS8EN2EWDSP2QKRJJ",
    votelogs: "01GXCM24QX3WZP1GBNFQEHSHME",
  },
  servers: {
    main: "01GXCH9VKDE12A76ZXZJMS0JS6",
    testing: "01GX1QRSHEA8NE8WCGHEPN3S19",
  },
  roles: {
    bots: "01GX2QPE8SWZWPVN3DFQGJCMHC",
    botsintesting: "01H0E1JT1C8TMAPNDJ15SCTA6W",
    developers: "01GZS6GRA53KVMDB4XY38MRMAE",
    members: "01GVC849ZNZYCC9BFYHNJSNNBB",
    staff: "01GX1RXVPQV3TNCTXS109H50DW",
    contributor: "01GZJ7Y5NFNB5JRHXYZWNGWZZZ",
    partner: "01H1DJ15N9N21RY3AH9XFPQYB9",
    certified: "01H1GB1BR01334NB3DJ30QXSAF",
    botCertified: "01H1GB1Q5B3Y1FDCMBCQ67A5FQ",
  },
};

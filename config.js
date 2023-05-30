require("dotenv").config();

module.exports = {
  port: 80,
  mongoURI:  process.env.mongoURI,
  sessionSecret: process.env.sessionSecret,
  ownerids: ["01GPZ5PTPQ2RNMZEF02NKD7TQE", "01GQ3NS0EB3FF8V2Q6KHX887DS"],
  clients: {
    manager: {
      prefix: "rbl!",
      token: process.env.managerToken,
    },
    servers: {
      prefix: "rsl!",
      token: process.env.serversToken
    }
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
    botsintesting: "01H0E1JT1C8TMAPNDJ15SCTA6W",
    developers: "01GZS6GRA53KVMDB4XY38MRMAE",
    members: "01GVC849ZNZYCC9BFYHNJSNNBB",
    staff: "01GX1RXVPQV3TNCTXS109H50DW",
    contributor: "01GZJ7Y5NFNB5JRHXYZWNGWZZZ",
    partner: "01H1DJ15N9N21RY3AH9XFPQYB9",
    certified: "01H1MG7T9CHX41XE36911GCT31",
    botCertified: "01H1MG7YA13EC3M0R4EGKRKXBD",
  },
};

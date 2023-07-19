const mongoose = require("mongoose");
const { MongooseBackup } = require("mongoose-backup");
const cron = require("node-cron");

let mongoURI = config.mongoURI; // 'mongodb://127.0.0.1:27017/RevoltBotList?retryWrites=true&w=majority'
try {
  mongoose.set("strictQuery", false);
  mongoose.connect(mongoURI)
    .then(console.info("[INFO] Connected to MongoDB."));
} catch (err) {
  console.log(`[ERROR] Connecting to MongoDB...`);
  console.error(err);
}
try {
  const Backup = new MongooseBackup({ url: mongoURI });
  Backup.on("connected", () => {
    Backup.Localize({ per: "hours" });
    Backup.on("localizeBackup", (data) => {
      console.log(
        `Total ${data.total} documents with ${data.items} items backed up.`
      );
    });
  });
} catch (e) {} 
//-DB-Caching-//
global.voteModel = require("./models/vote");
global.botModel = require("./models/bot");
global.userModel = require("./models/user");
global.loginModel = require("./models/loginRequest");
global.reportModel = require("./models/report");
global.serverModel = require("./models/server")
//-Updater-//
cron.schedule("*/30 * * * *", () => {
  global.voteModel = require("./models/vote");
  global.botModel = require("./models/bot");
  global.userModel = require("./models/user");
  global.loginModel = require("./models/loginRequest");
  global.reportModel = require("./models/report");
  global.serverModel = require("./models/server")
});

cron.schedule("* * */ 1 * *", async () => {
  let dbots = await global.botModel.find({ status: "denied" });
  if (!dbots.length) return;
  const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
  for (const bot of dbots) {
    if (bot.deniedOn <= yesterday) {
      bot.remove().catch(() => null);
    }
  }
  for (const user of dusers) {

  }
});
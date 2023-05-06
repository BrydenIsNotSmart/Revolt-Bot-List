const mongoose = require("mongoose");
const { MongooseBackup } = require("mongoose-backup");
const cron = require("node-cron");

try {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(config.mongoURI)
    .then(console.info("[INFO] Connected to MongoDB."));
} catch (err) {
  console.log(`[ERROR] Connecting to MongoDB...`);
  console.error(err);
}
try {
  const Backup = new MongooseBackup({ url: config.mongoURI });
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

//-Updater-//
cron.schedule("*/30 * * * *", () => {
  global.voteModel = require("./models/vote");
  global.botModel = require("./models/bot");
  global.userModel = require("./models/user");
  global.loginModel = require("./models/loginRequest");
});

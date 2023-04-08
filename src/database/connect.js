const mongoose = require('mongoose');
const cron = require("node-cron");

try {
    mongoose.set('strictQuery', false);
    mongoose.connect(config.mongoURI).then(
        console.info("[INFO] Connected to MongoDB.")
    )
} catch(err) {
    console.log(`[ERROR] Connecting to MongoDB...`)
    console.error(err)
}

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
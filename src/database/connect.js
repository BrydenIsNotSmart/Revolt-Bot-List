const mongoose = require('mongoose');

try {
    mongoose.set('strictQuery', false);
    mongoose.connect(config.mongoURI).then(
        console.info("[INFO] Connected to MongoDB.")
    )
} catch(err) {
    console.log(`[ERROR] Connecting to MongoDB...`)
    console.error(err)
}


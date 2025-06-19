const { DBconfig } = require('./config')
const mongoose = require('mongoose'); // Semicolon is added here as program only below this line and the above codes are not executed 

(async() => {
    try {
        await mongoose.connect(DBconfig.mongodbURL, {
            dbName: DBconfig.mongodbName,
            autoCreate: true, // Automatically create the database if it doesn't exist
            autoIndex: true, // Automatically create indexes
        });
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.log('Error connecting to MongoDB:', err);
        process.exit(1); // Exit the process with a failure code
    }
})();


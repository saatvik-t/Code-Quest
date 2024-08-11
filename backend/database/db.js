const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' })

const DBConnection = async () => {
    try {
        const MONGO_URI = process.env.MONGODB_URL;
        await mongoose.connect(MONGO_URI);
        console.log('Database Connection is established !');
    } catch (error) {
        console.log('Error while connecting to MongoDB : ', error.message);
        process.exit(1);
    }
}

module.exports = { DBConnection };
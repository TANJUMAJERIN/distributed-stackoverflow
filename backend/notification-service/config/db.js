

const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect("mongodb://notification-db:27017/notification-service-db")
        .then(() => console.log('Connected to MongoDB!'))
        .catch((err) => {
            console.log('Connection failed:', err);
            process.exit(1);  // Exit process with failure
        });
};

module.exports = connectDB;


const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect("mongodb://post-db:27017/post-service-db")
  
        .then(() => console.log('Connected to MongoDB!'))
        .catch((err) => {
            console.log('Connection failed:', err);
            process.exit(1);  // Exit process with failure
        });
};

module.exports = connectDB;

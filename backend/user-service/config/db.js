// const mongoose = require('mongoose');

// const connectDB = () => {
//     mongoose.connect("mongodb+srv://bsse1312:iIQHwbxHsobReHXZ@stack-db.igxnz.mongodb.net/user?retryWrites=true&w=majority&appName=user")
//         .then(() => console.log('Connected to MongoDB!'))
//         .catch((err) => {
//             console.log('Connection failed:', err);
//             process.exit(1);  // Exit process with failure
//         });
// };

// module.exports = connectDB;
//

const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect("mongodb://user-db:27017/user-service-db")
        .then(() => console.log('Connected to MongoDB!'))
        .catch((err) => {
            console.log('Connection failed:', err);
            process.exit(1);  // Exit process with failure
        });
};

module.exports = connectDB;

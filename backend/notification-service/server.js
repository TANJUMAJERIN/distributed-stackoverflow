const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const connectDB = require('./config/db'); 


const notificationRoutes = require('./routes/notificationRoutes');



const app = express();

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true  // Important for session-based authentication
}));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


connectDB();

app.use('/', notificationRoutes);  


app.get('/', (req, res) => {
    res.send('Hello from noti-service');
});


const PORT = 5007;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



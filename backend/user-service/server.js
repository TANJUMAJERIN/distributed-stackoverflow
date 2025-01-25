const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const connectDB = require('./config/db'); 
const userRoutes = require('./routes/user'); 

const app = express();


app.use(cors({
    origin: 'http://localhost:3000',  
    credentials: true  
}));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(session({
    secret: 'your-secret-key',  
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use('/', userRoutes);


app.get('/', (req, res) => {
    res.send('Hello from Node user-service');
});


const PORT = 5005;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



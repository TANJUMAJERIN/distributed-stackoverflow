const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const connectDB = require('./config/db'); 

const postRoutes = require('./routes/postRoutes'); 


const app = express();


app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true  
}));

app.use(express.json());



connectDB();


app.use('/', postRoutes);


app.get('/', (req, res) => {
    res.send('Hello from post-service');
});


const PORT = 5006;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const connectDB = require('./config/db'); // MongoDB connection
const userRoutes = require('./routes/user'); // User routes
const postRoutes = require('./routes/postRoutes'); // Post routes


const notificationRoutes = require('./routes/notificationRoutes');



const app = express();

// Use CORS to allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:3000',  // Allow frontend requests
    credentials: true  // Important for session-based authentication
}));

// Parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup session for authentication
app.use(session({
    secret: 'your-secret-key',  // Replace with a strong key
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
connectDB();

// Use the user routes for user authentication and related actions
app.use('/api/user', userRoutes);

// Use the post routes for handling posts
app.use('/api/posts', postRoutes);

// Use the notification routes for handling notifications
app.use('/api/notifications', notificationRoutes);  // Add this line for notification routes

// Test route
app.get('/', (req, res) => {
    res.send('Hello from Node API server');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



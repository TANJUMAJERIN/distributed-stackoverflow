const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Assuming you have a User model

const app = express();

// Use CORS to allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:3000'  // Allow frontend requests
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

// Passport LocalStrategy for email/password authentication
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return done(null, false, { message: 'User not found' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// MongoDB connection (without .env)
mongoose.connect("mongodb+srv://bsse1312:iIQHwbxHsobReHXZ@stack-db.igxnz.mongodb.net/stack-db")
    .then(() => console.log('Connected to MongoDB!'))
    .catch((err) => console.log('Connection failed:', err));

// Route to handle user registration (SignUp)
app.post('/api/signUp', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password before saving the user
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to handle user login (SignIn)
app.post('/api/signIn', passport.authenticate('local'), (req, res) => {
    res.status(200).json({ message: 'Login successful', user: req.user });
});

// Route to handle logout
app.get('/api/logout', (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ message: 'Error logging out' });
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Test route
app.get('/', (req, res) => {
    res.send('Hello from Node API server');
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});











//...............................
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors'); // Import CORS
// const User = require('./models/User');

// const app = express();

// // Use CORS middleware
// app.use(cors({
//     origin: 'http://localhost:3000'  // Allow requests from the frontend
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// app.listen(5000, () => {
//     console.log('server is running on port 5000');
// });

// app.get('/', (req, res) => {
//     res.send('Hello from Node API server');
// });

// mongoose.connect("mongodb+srv://bsse1312:iIQHwbxHsobReHXZ@stack-db.igxnz.mongodb.net/stack-db?retryWrites=true&w=majority&appName=stack-db")
//   .then(() => {
//       console.log('Connected to MongoDB!');
//   })
//   .catch(() => {
//       console.log('Connection failed!');
//   });

// app.post('/api/signUp', async (req, res) => {
//     try {
//         const client = await User.create(req.body);
//         res.status(200).json(client);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });






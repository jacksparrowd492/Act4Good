// setAdmin.js

const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust the path if necessary

// Connect to your MongoDB database
mongoose.connect('mongodb+srv://srikrish2705guru:Va4ttleQLhsTxr8L@ngo.d2f9c.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Function to set admin credentials
async function setAdmin(email) {
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            user.isAdmin = true;
            await user.save();
            console.log(`User with email ${email} is now an admin.`);
        } else {
            console.log(`User with email ${email} not found.`);
        }
    } catch (error) {
        console.error('Error setting admin credentials:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Call the function with the email of the user you want to make an admin
setAdmin('d1u2m3m4@gmail.com');
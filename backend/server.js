// server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('../backend/routes/authRoutes');
const postRoutes = require('../backend/routes/postRoutes');
const likeRoutes = require('../backend/routes/likeRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://srikrish2705guru:Va4ttleQLhsTxr8L@ngo.d2f9c.mongodb.net/', {
    family: 4
})
    .then(() => console.log("Mongo DB Connected"))
    .catch(error => console.log(error));

app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/like', likeRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

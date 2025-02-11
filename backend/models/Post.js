// postModel.js

const mongoose = require('mongoose');
const User = require('./User');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: User,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        default: ''
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: User
        }
    ],
    attachment: {
        type: String
    }
});

module.exports = mongoose.model('Post', postSchema);

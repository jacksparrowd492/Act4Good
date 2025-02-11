// postController.js

const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const secretKey = 'jwtSecret';
const multer = require('multer');
const path = require('path');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username'); // Populate author with username
        res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate('author', 'username'); // Populate author with username
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getMyPosts = async (req, res) => {
    let userId;
    try {
        jwt.verify(req.headers['authorization'].substring(7), secretKey, (error, decodedToken) => {
            if (error) {
                res.status(401).json({
                    success: false,
                    message: error.message
                });
            } else {
                userId = decodedToken.user.id;
            }
        });
        const posts = await Post.find({ author: userId }).populate('author', 'username'); // Populate author with username
        res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.createPost = async (req, res) => {
    try {
        let post = {};
        const { title, content, category, attachment, createdAt, updatedAt } = req.body.post;
        if (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ')) {
            jwt.verify(req.headers['authorization'].substring(7), secretKey, (error, decodedToken) => {
                if (error) {
                    res.status(401).json({
                        success: false,
                        message: error.message
                    });
                } else {
                    post = new Post({
                        title: title,
                        content: content,
                        author: decodedToken.user.id,
                        createdAt: createdAt,
                        updatedAt: updatedAt,
                        category: category,
                        likes: [],
                        attachment: attachment
                    });
                }
            });
            await post.save();
            res.status(200).json(post);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { title, content, category, attachment } = req.body;
        const post = await Post.findByIdAndUpdate(postId, {
            title: title,
            content: content,
            category: category,
            attachment: attachment
        }, { new: true });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        await Post.findByIdAndDelete(postId);
        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: true,
            message: error.message
        });
    }
};